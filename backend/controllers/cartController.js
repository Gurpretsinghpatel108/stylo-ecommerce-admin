const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { userId: req.user.id, items: [] }
      });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("GET CART ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, price, name, image, selectedSize } = req.body;
    if (!productId || !price || !name) return res.status(400).json({ success: false, message: "Missing required fields" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const prodId = mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : productId;

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === prodId.toString() && String(item.selectedSize || "") === String(selectedSize || "")
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: prodId,
        quantity: Number(quantity),
        price: Number(price),
        name,
        image: image || "",
        selectedSize: selectedSize || null
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ success: true, message: "Item added to cart!", cart });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE ITEM QUANTITY
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, selectedSize } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && String(item.selectedSize || "") === String(selectedSize || "")
    );
    if (itemIndex < 0) return res.status(404).json({ success: false, message: "Item not found" });

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedSize } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && String(item.selectedSize || "") === String(selectedSize || ""))
    );

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ success: true, message: "Item removed", cart });
  } catch (error) {
    console.error("REMOVE ITEM ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// SYNC CART AFTER LOGIN
exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    items.forEach(localItem => {
      const index = cart.items.findIndex(
        i => i.productId.toString() === localItem._id && String(i.selectedSize || "") === String(localItem.selectedSize || "")
      );
      if (index > -1) cart.items[index].quantity += localItem.quantity;
      else cart.items.push({
        productId: localItem._id,
        quantity: localItem.quantity,
        price: localItem.currentPrice,
        name: localItem.name,
        image: localItem.image,
        selectedSize: localItem.selectedSize || null
      });
    });

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("SYNC CART ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
