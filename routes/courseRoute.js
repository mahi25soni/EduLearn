const express = require("express")
const { createCourse, addChapter, addContent } = require("../controllers/couseCreateController")
const router = express.Router()



router.post("/createCourse", createCourse)
router.post("/addChapter/:course_id", addChapter)
router.post("/addContent/:chapter_id", addContent)


// onChange ka use karke pata chal jayega konsi field mei change hai
// and then woh woh field inn updates wali functino mei bhej di jaayegi
router.patch("update/:course_id")
router.patch("update/chapter/:chapter_id")
router.patch("update/content/:content_id")

router.get("/course_id") // return the launched course 


module.exports = router;