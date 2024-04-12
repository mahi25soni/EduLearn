const express = require("express")
const router = express.Router();


router.post("/create/:course_id")
router.get("/get_all/:course_id")
router.delete("/delete/:review_id")
router.post("/update/review_id")

router.post("/rating/create/:course_id")

module.exports = router;