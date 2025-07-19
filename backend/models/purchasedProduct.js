const mongoose = require("mongoose");

const purchasedProductSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    paymentMethod: { type: String, enum: ["khalti"], required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const PurchasedProduct = mongoose.model(
  "PurchasedProduct",
  purchasedProductSchema
);
module.exports = PurchasedProduct;
