const express = require("express");
const auth = require("../../middlewares/auth");
const { GetAllTerms, UpdateTerms } = require("../../controllers/TarmsConditions.controller");

const router = express.Router();


router.put(
  "/:id",
  auth("admin"),
  UpdateTerms
);

router.get("/", auth("common"), GetAllTerms);


module.exports = router;
