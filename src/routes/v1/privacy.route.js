const express = require("express");
const auth = require("../../middlewares/auth");
const { GetPrivacy, UpdatePrivacy } = require("../../controllers/privacy.controller");

const router = express.Router();


router.put(
  "/:id",
  auth("admin"),
  UpdatePrivacy
);

router.get("/", auth("common"), GetPrivacy);

module.exports = router;
