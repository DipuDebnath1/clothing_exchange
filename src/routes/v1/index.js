const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const paymentRoute = require("./payment.route");
const subscriptionRoute = require("./subscription.route");
const notificationRoute = require("./notification.route");
const ConversationRoute = require("./conversation.route");
// const AboutRoute = require("./about.route");
const FaqRoute = require("./faq.route");
const TermsRoute = require("./termsCondition.route");
const PrivacyRoute = require("./privacy.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/subscription",
    route: subscriptionRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path: "/conversation",
    route: ConversationRoute,
  },
  // {
  //   path: "/about",
  //   route: AboutRoute,
  // },
  {
    path: "/faq",
    route: FaqRoute,
  },
  {
    path: "/term_condition",
    route: TermsRoute,
  },
  {
    path: "/privacy_policy",
    route: PrivacyRoute,
  },

];

const devRoutes = [
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
