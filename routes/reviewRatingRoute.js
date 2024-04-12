const express = require("express");
const { postRating } = require("../controllers/reviewRatingController");
const router = express.Router();


router.post("/create/:course_id")
router.get("/get_all/:course_id")
router.delete("/delete/:review_id")
router.post("/update/review_id")

router.post("/rating/create/:course_id", postRating)

module.exports = router;