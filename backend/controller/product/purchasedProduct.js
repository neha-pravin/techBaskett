const PurchasedProduct = require("../../models/purchasedProduct");

const getAllOrders = async (req, res) => {
  try {
    // Populate user and product details for each order
    const orders = await PurchasedProduct.find()
      .populate("userId", "name email")
      .populate("products.productId", "productName productImage");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

module.exports = { getAllOrders };
