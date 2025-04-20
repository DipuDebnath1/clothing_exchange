const httpStatus = require("http-status");
const moment = require("moment") // To help with date manipulation
const { Transaction, User, SubscriptionPurchase } = require("../models");
const ApiError = require("../utils/ApiError");
const { ObjectId } = require("mongoose").Types;

const allTransaction = async (page=1, limit=10) => {
  page = Math.max(1, parseInt(page, 10));
  limit = Math.max(1, parseInt(limit, 10));

  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  const [totalCount, allEvent] = await Promise.all([
    Transaction.countDocuments(),
    Transaction.find()
      .skip(skip)
      .limit(limit)
      .select("transactionId status createdAt")
      .populate("author", "fullName email phoneNumber")
      .populate(
        "subscriptionPurchaseId",
        "packageDurationType packageDuration packagePrice"
      ), // Add limit here
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    totalPages,
    currentPage: page,
    totalResults: totalCount,
    resultsPerPage: limit, // Use limit here
    result: allEvent,
  };
};

const todaySubscribers = async () => {
  const subscribers = await Transaction.countDocuments({
    status: "success",
    createdAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
      $lt: new Date(new Date().setHours(23, 59, 59, 999)), // End of today
    },
  })
  return{subscribers}
};

const singleTransaction = async (id) => {
  const res = await Transaction.findById(id)
    .select("transactionId status createdAt amount")
    .populate("author", "fullName email phoneNumber")
    .populate(
      "subscriptionPurchaseId",
      "packageDurationType packageDuration packagePrice "
    );
  if (!res) {
    throw new ApiError(httpStatus.NOT_FOUND, " not found");
  }
  return res;
};

const subscribers = async (id, page = 1, limit = 10) => {
  const currentDate = new Date();
  const filter = {};

  // Apply filter based on id or active subscription end date
  if (id) {
    filter._id = new ObjectId(id);
  } else {
    filter.subscriptionEnd = { $gt: currentDate };
  }

  // Paginate: skip and limit based on current page and limit
  page = Math.max(1, parseInt(page, 10));
  limit = Math.max(1, parseInt(limit, 10));
  const skip = (page - 1) * limit;

  // Aggregate users
  const [total, users] = await Promise.all([
    User.countDocuments(filter), // Count total users based on the filter
    User.aggregate([
      { $match: filter }, // Filter users with active subscriptions
      {
        $lookup: {
          from: "subscriptionpurchases", // Correct collection name
          localField: "_id", // Match with the User collection _id
          foreignField: "author", // Field in subscriptionpurchases collection
          as: "subscriptionPurchase", // Alias for the resulting array
        },
      },
      {
        $unwind: {
          path: "$subscriptionPurchase", // Unwind the subscriptionPurchase array
          preserveNullAndEmptyArrays: true, // Keep users even without subscriptions
        },
      },
      {
        $lookup: {
          from: "subscriptions", // Correct collection name
          localField: "subscriptionPurchase.subscription", // Match the subscriptionPurchase subscription field with subscriptions _id
          foreignField: "_id", // Match the subscription _id in the subscriptions collection
          as: "subscription", // Alias for the resulting array
        },
      },
      {
        $unwind: {
          path: "$subscription", // Unwind the subscription array
          preserveNullAndEmptyArrays: true, // Keep users without subscriptions
        },
      },
      {
        $sort: {
          "subscriptionPurchase.subscriptionStartDate": -1, // Sort by the latest subscription start date
        },
      },
      {
        $group: {
          _id: "$_id", // Group by user ID
          fullName: { $first: "$fullName" }, // Get the first value of fullName
          email: { $first: "$email" }, // Get the first value of email
          phoneNumber: { $first: "$phoneNumber" }, // Get the first value of phoneNumber
          subscriptionStartDate: { $first: "$subscriptionPurchase.startDate" }, // Get the first (latest) subscription start date
          subscriptionEndDate: { $first: "$subscriptionPurchase.endDate" }, // Get the first (latest) subscription end date
          subscriptionPrice: { $first: "$subscription.packagePrice" }, // Get the first (latest) subscription price
          packageDurationType: { $first: "$subscription.packageDurationType" }, // Get the first (latest) package duration type
          packageDuration: { $first: "$subscription.packageDuration" }, // Get the first (latest) package duration
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          phoneNumber: 1,
          subscriptionStartDate: 1,
          subscriptionEndDate: 1,
          subscriptionPrice: 1,
          packageDurationType: 1,
          packageDuration: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip }, // Skip results for pagination
      { $limit: limit }, // Limit results for pagination
    ]),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    results: users,
    totalResults: total,
    resultsPerPage: limit,
    totalPages: totalPages,
    currentPage: page,
  };
};

const monthlyIncome = async () => {
  const currentMonth = moment(); // Current month
  const months = []; // Array to hold last 12 months data
  
  // Generate last 12 months
  for (let i = 0; i < 12; i++) {
    const monthStart = currentMonth.clone().subtract(i, 'months').startOf('month');
    const monthEnd = currentMonth.clone().subtract(i, 'months').endOf('month');
  
    months.push({
      month: monthStart.format("MMM"), // Get 3-letter month abbreviation
      start: monthStart.format("YYYY-MM-DD"), // Start of the month
      end: monthEnd.format("YYYY-MM-DD"), // End of the month
    });
  }

  // Sort months from the most recent to the oldest
  months.sort((a, b) => moment(b.start).isBefore(a.start) ? 1 : -1);

  // Get monthly income for each month
  const monthlyIncome = await Promise.all(
    months.map(async (month) => {
      // Aggregate income for the month
      const result = await Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(month.start), $lte: new Date(month.end) },
            status: "success", // Only consider successful transactions
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$amount" }, // Sum up the total amount for the month
          },
        },
      ]);
  
      // Return the month and its total income, or 0 if no income found
      return {
        month: month.month,
        income: result?.[0]?.totalIncome || 0, // If no income, set it to 0
      };
    })
  );

  return monthlyIncome;
};


const lastSubscriptionPurchasedUser = async () => {
  const user = await SubscriptionPurchase.find().sort({ createdAt: -1 }).populate("author", "fullName email phoneNumber").populate("subscription", "packageDurationType packageDuration packagePrice").limit(6);
  return user;
}

module.exports = {
  allTransaction,
  todaySubscribers,
  monthlyIncome,
  
  singleTransaction,
  subscribers,
  lastSubscriptionPurchasedUser
};
