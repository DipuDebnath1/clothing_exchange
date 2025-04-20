const express = require("express");
const auth = require("../../middlewares/auth");
const { CreateAbout, UpdateAbout, GetAllAbout, DeleteAbout } = require("../../controllers/about.controller");

const router = express.Router();

router.post(
  "/",
  auth("admin"),
  CreateAbout
);

router.put(
  "/:about_id",
  auth("admin"),
  UpdateAbout
);

router.get("/", auth("common"), GetAllAbout);

router.delete("/:about_id", auth("admin"), DeleteAbout);

module.exports = router;
