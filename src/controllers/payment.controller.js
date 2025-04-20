const httpStatus = require("http-status");
const moment = require("moment");
const {
  Transaction,
  Booking,
  Subscription,
  SubscriptionPurchase,
  User,
} = require("../models");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");
const {
  allTransaction,
  singleTransaction,
  subscribers,
  todaySubscribers,
  monthlyIncome,
  lastSubscriptionPurchasedUser,
} = require("../services/payment.service");
const { sendNotification } = require("../services/notification.service");
const { sendAdminMessage } = require("../services/email.service");

const BookSubEventPayment = catchAsync(async (req, res) => {
  const { id } = req.user;
  try {
    const { subEvent, amount, transactionId, status } = req.body;

    if (status === "success") {
      const newBooking = new Booking({
        id,
        subEvent,
        status: "pending",
      });

      const booking = await newBooking.save();

      const newPayment = new Transaction({
        id,
        transactionType: "subEventBooking",
        amount,
        subEventBookingId: booking._id,
        transactionId,
        status,
      });

      const payment = await newPayment.save();

      res.status(200).json(
        response({
          message: "payment completed. event booking successfully. ",
          status: "success",
          statusCode: httpStatus.OK,
          data: { booking, payment },
        })
      );
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Payment failed, appointment not created",
      });
    }
  } catch (err) {
    // Consider logging the error for debugging purposes
    console.error("Checkout error:", err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
});

const subscriptionPurchase = catchAsync(async (req, res) => {
  try {
    const { id, email } = req.user;
    const user = await User.findById(id);
    const { subscription_id, amount, transaction_id, status } = req.body;
    const useTransactionId = await Transaction.findOne({
      transactionId: transaction_id,
    });
    if (useTransactionId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "this transaction you already used !"
      );
    }

    const subscription = await Subscription.findById(subscription_id);
    if (!subscription) {
      throw new ApiError(httpStatus.NOT_FOUND, "subscription already deleted");
    }
    if (subscription.status !== "active") {
      throw new ApiError(httpStatus.NOT_FOUND, "subscription is not active");
    }
    if (subscription.amount < amount) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `you can't provide subscription package amount ! 
        package amount is ${subscription.amount} and paid amount.`
      );
    }

    if (status === "success") {
      const startDate = new Date();

      // Determine endDate based on packageDurationType
      let endDate = new Date(startDate);
      if (subscription.packageDurationType === "day") {
        endDate.setDate(endDate.getDate() + subscription.packageDuration);
      } else if (subscription.packageDurationType === "month") {
        endDate.setMonth(endDate.getMonth() + subscription.packageDuration);
      }

      //update user subscription limit
      if (user?.subscriptionEnd && user?.subscriptionEnd > startDate) {
        user.isSubscribe=true
        user.subscriptionEnd = endDate;
        await user.save();
      } else {
        user.isSubscribe=true
        user.subscriptionStart = startDate;
        user.subscriptionEnd = endDate;
        await user.save();
      }
      
      // Create Subscription Purchase
      const subscriptionPurchase = new SubscriptionPurchase({
        author: id,
        subscription: subscription_id,
        startDate,
        endDate,
      });
      const subscriptionPurchaseRes = await subscriptionPurchase.save();

      if (!subscriptionPurchase) {
        throw new ApiError(httpStatus.NOT_FOUND, "Subscription Purchase failed !")
      }

      // create transaction
      const newPayment = new Transaction({
        author: id,
        transactionType: "SubscriptionPurchase",
        amount,
        subscription: subscriptionPurchaseRes._id,
        transactionId: transaction_id,
        status,
      });
      const payment = await newPayment.save();

      const notification = {
        userId:id,
        role:"user",
        title:"Subscription Purchase Success.",
        content:`subscription purchase success. subscription validity from ${startDate} to ${endDate}.`
      }

      await sendNotification(id,notification)
      await sendAdminMessage(email, notification.title, notification.
        content
       )
      

      res.status(200).json(
        response({
          message: "payment completed. event booking successfully. ",
          status: "success",
          statusCode: httpStatus.OK,
          data: {subscription:subscriptionPurchase, payment:payment},
        })
      );
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Payment failed, appointment not created",
      });
    }
  } catch (err) {
    // Consider logging the error for debugging purposes
    console.error("Checkout error:", err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
});

//TodayIncome
const TodayIncome = catchAsync(async (req, res) => {
  const startOfDay = moment().startOf("day").toDate(); // Get the start of today (00:00:00)
  const endOfDay = moment().endOf("day").toDate(); // Get the end of today (23:59:59)

  // Aggregate the transactions of today and sum up the amount
  const result = await Transaction.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        status: "success", // Only consider successful transactions
      },
    },
    {
      $group: {
        _id: null, // Grouping by null means we want the total sum of the whole collection
        totalIncome: { $sum: "$amount" }, // Sum the amount field
      },
    },
  ]);

  res.status(httpStatus.OK).json(
    response({
      message: "todays income retrieved success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result.length > 0 ? result[0] : { totalIncome: 0 },
    })
  );
});

//MonthlyIncome
const MonthlyIncome = catchAsync(async (req, res) => {
  const result = await monthlyIncome();

  res.status(httpStatus.OK).json(
    response({
      message: "monthly Income result retrieved success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

//TodaySubscribers
const TodaySubscribers = catchAsync(async (req, res) => {
  const result = await todaySubscribers();

  res.status(httpStatus.OK).json(
    response({
      message: "todays result success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

//AllTransaction
const AllTransaction = catchAsync(async (req, res) => {
  // Aggregate the transactions of today and sum up the amount
  const { page, limit } = req.query;
  const result = await allTransaction(page, limit);

  res.status(httpStatus.OK).json(
    response({
      message: "all transaction retrieved success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

//SingleTransaction
const SingleTransaction = catchAsync(async (req, res) => {
  const { id } = req.params;
  // Aggregate the transactions of today and sum up the amount
  const result = await singleTransaction(id);

  res.status(httpStatus.OK).json(
    response({
      message: "transaction retrieved success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});


//Subscribers
const Subscribers = catchAsync(async (req, res) => {
  const { user, page, limit } = req.query;
  // Aggregate the transactions of today and sum up the amount
  const result = await subscribers(user, page, limit);

  res.status(httpStatus.OK).json(
    response({
      message: "Subscribers retrieved success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

//LastSubscriptionPurchasedUser
const LastSubscriptionPurchasedUser = catchAsync(async (req, res) => {
  // Aggregate the transactions of today and sum up the amount
  const result = await lastSubscriptionPurchasedUser();

  res.status(httpStatus.OK).json(
    response({
      message: "Last Subscription Purchased Users retrieved success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  BookSubEventPayment,
  subscriptionPurchase,
  AllTransaction,
  SingleTransaction,
  TodayIncome,
  Subscribers,
  TodaySubscribers,
  MonthlyIncome,
  LastSubscriptionPurchasedUser,
};
