const express = require("express");
const { postRating, createReview, getAllReviews, deleteReview} = require("../controllers/reviewRatingController");
const router = express.Router();


router.post("/create/:course_id", createReview)
router.get("/get_all/:course_id", getAllReviews)
router.delete("/delete/:review_id", deleteReview)

router.post("/rating/create/:course_id", postRating)

module.exports = router;