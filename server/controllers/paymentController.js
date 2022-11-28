import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";

export const checkout = async (req, res) => {
  /// FETCH USER ORDER SUMMARY DETAILS 

  const options = {
    amount: Number(300 * 100),
    currency: "INR",
    ///receipt: "order_rcptid_11"
  };

  const order = await instance.orders.create(options);

  if (!order) return res.status(500).send({
    success: false,
    message: "Some error occured"
  });

  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    /// Database comes here


    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.status(200).json({
      success: true,
      message: 'payment varified'
    })
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
