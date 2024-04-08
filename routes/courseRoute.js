const express = require("express")
const { createCourse, addChapter, updateCourse, updateChapter, deleteCourse, deleteChapter } = require("../controllers/courseController")
const router = express.Router()



router.post("/createCourse", createCourse)
router.post("/addChapter/:course_id", addChapter)

// onChange ka use karke pata chal jayega konsi field mei change hai
// and then woh woh field inn updates wali functino mei bhej di jaayegi
router.patch("/update/:course_id", updateCourse)
router.patch("/update/chapter/:chapter_id", updateChapter)

router.delete("/delete/:course_id", deleteCourse)
router.delete("/delete/chapter/:chapter_id", deleteChapter)


router.post("/addContent/:chapter_id")
router.patch("/update/content/:content_id")
router.delete("/delete/content/:content_id")



router.get("/course_id") // return the launched course 


module.exports = router;