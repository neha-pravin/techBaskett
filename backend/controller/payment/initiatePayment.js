const product = require("../../models/productModel");
const PurchasedItem = require("../../models/purchasedProduct");
const Payment = require("../../models/paymentModel");
const addToCartModel = require("../../models/cartProduct");
const {
  initializeKhaltiPayment,
  verifyKhaltiPayment,
} = require("../../controller/payment/khalti");

const initiatePayment = async (req, res) => {
  try {
    const { products, totalPrice, website_url } = req.body;

    // Fetch all products from DB
    const productIds = products.map((p) => p.productId);
    const items = await product.find({ _id: { $in: productIds } });

    if (!items.length || items.length !== products.length) {
      return res.status(400).send({
        success: false,
        message: "One or more items not found",
      });
    }

    // Calculate total price from DB prices
    let calculatedTotal = 0;
    items.forEach((item) => {
      const cartItem = products.find(
        (p) => p.productId === String(item._id)
      );
      calculatedTotal += item.sellingPrice * cartItem.quantity;
    });

    if (calculatedTotal !== totalPrice) {
      return res.status(400).send({
        success: false,
        message: "Total price mismatch",
      });
    }

    // Create purchase record
    const purchasedItemData = await PurchasedItem.create({
      products, // save all products and quantities
      paymentMethod: "khalti",
      totalPrice: totalPrice * 100,
      userId: req.userId,
    });

    const paymentInitate = await initializeKhaltiPayment({
      amount: totalPrice * 100,
      purchase_order_id: purchasedItemData._id,
      purchase_order_name: "Multiple Products",
      return_url: `${process.env.FRONTEND_URL}/payment-verify`,
      website_url,
    });

    res.json({
      success: true,
      payment_url: paymentInitate.payment_url,
      purchasedItemData,
      purchase_order_id: purchasedItemData._id,
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
};

// it is our `return url` where we verify the payment done by user
const completeKhaltiPayment = async (req, res) => {
  const {
    pidx,
    txnId,
    amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    transaction_id,
  } = req.query;

  try {
    const paymentInfo = await verifyKhaltiPayment(pidx);

    // Check if payment is completed and details match
    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete information",
        paymentInfo,
      });
    }

    // Check if payment done in valid item
    const purchasedItemData = await PurchasedItem.find({
      _id: purchase_order_id,
      totalPrice: amount,
    });

    if (!purchasedItemData) {
      return res.status(400).send({
        success: false,
        message: "Purchased data not found",
      });
    }
    // updating purchase record
    await PurchasedItem.findByIdAndUpdate(
      purchase_order_id,

      {
        $set: {
          status: "completed",
        },
      }
    );

    // Create a new payment record
    const paymentData = await Payment.create({
      pidx,
      transactionId: transaction_id,
      productId: purchase_order_id,
      amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "khalti",
      status: "success",
    });
    // update users cart by all product of the user
    await addToCartModel.deleteMany({ userId: req.userId });
    // Send success response
    res.json({
      success: true,
      message: "Payment Successful",
      paymentData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error,
    });
  }
};
module.exports = { initiatePayment, completeKhaltiPayment };
