const express = require("express");
const {
  CreateFAQ,
  GetFAQs,
  UpdateFAQ,
  DeleteFAQ,
} = require("../../controllers/faq.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/", auth("admin"), CreateFAQ);
router.get("/", auth("common"), GetFAQs);
router.put("/:faqId", auth("admin"), UpdateFAQ);
router.delete("/:faq_id", auth("admin"), DeleteFAQ);



module.exports = router;

