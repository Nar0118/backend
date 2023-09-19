const Router = require("express");
const OrderController = require("./controllers/OrderController");
const router = new Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { price, userId, subtotal, deviceIds } = req.body.cartItems;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "amd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.DOMAIN}/checkout-success`,
    cancel_url: `${process.env.DOMAIN}/checkout`,
  });
  if (session) {
    OrderController.create({ userId, subtotal, deviceIds });
  }
  res.send({ url: session.url });
});

module.exports = router;
