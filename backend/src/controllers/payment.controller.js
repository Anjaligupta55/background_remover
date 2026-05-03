const Razorpay = require('razorpay');
const crypto = require('crypto');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');
const Payment = require('../models/Payment');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

const PLANS = {
  basic: {
    amount: 99,
    credits: 50
  },
  pro: {
    amount: 299,
    credits: 200
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
exports.createOrder = async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const amount = PLANS[plan].amount * 100; // to paise
    const currency = 'INR';

    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment Verified
      const creditsToAdd = PLANS[plan].credits;

      // Update User
      const user = await User.findById(req.user.id);
      user.credits += creditsToAdd;
      user.plan = plan;
      await user.save();

      // Create Payment Record
      await Payment.create({
        user: req.user.id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: PLANS[plan].amount,
        plan,
        creditsAdded: creditsToAdd,
        status: 'completed'
      });

      res.json({
        success: true,
        message: 'Payment verified and credits added',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          credits: user.credits,
          plan: user.plan
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature, payment verification failed'
      });
    }
  } catch (error) {
    next(error);
  }
};
