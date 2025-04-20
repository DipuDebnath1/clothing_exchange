const admin = require("../config/firebase.config");
const { Notification } = require("../models");

const sendPushNotification = async (user, data) => {
  console.log({ user: user, data: data });

  if (data?.role === "admin") {
    const newNotification = new Notification({
      userId: user._id,
      sendBy: data.sendBy || null,
      role: data.role || "",
      title: data.title || "",//
      content: data.content || "",
      transactionId: data.transactionId || null,
      subEventId: data.subEventId || null,
      status: "unread",
      priority: data.priority || "medium",
    });

    await newNotification.save();

    console.log("Successfully sent push notification and saved to database:");
  } else {
    const message = {
      notification: {
        title: `${data.title}`,
        body: `${data.content}`,
      },
      data: {
        userId: user._id.toString(),
        data: data.toString(),
      },
      token: user.fcmToken,
    };

    try {
      const response = await admin.messaging().send(message);

      const newNotification = new Notification({
        userId: user._id,
        sendBy: data.sendBy || null,
        role: data.role || "",
        title: data.title || "",
        content: data.content || "",
        transactionId: data.transactionId || null,
        subEventId: data.subEventId || null,
        status: "unread",
        priority: data.priority || "medium",
      });

      // Save the notification to the database
      await newNotification.save();

      console.log(
        "Successfully sent push notification and saved to database:",
        response
      );
    } catch (error) {
      console.error(
        "Error sending push notification or saving to database:",
        error
      );
    }
  }
};

module.exports = sendPushNotification;
