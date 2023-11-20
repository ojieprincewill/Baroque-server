const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Server running on port ${PORT}`);
});

app.post("/charge", async (req, res) => {
  try {
    const { amount, source, currency } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
    });

    console.log("Payment successful:", charge);

    res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Payment failed" });
  }
});
