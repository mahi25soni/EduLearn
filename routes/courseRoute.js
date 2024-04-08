const express = require("express")
const router = express.Router()

const { createCourse, addChapter, updateCourse, updateChapter, deleteCourse, deleteChapter, getCourseById } = require("../controllers/courseController")
const { addContent } = require("../controllers/contentContoller")
const {isAdmin, isInstructor, isStudent} = require("../middlewares/userAuth")


router.post("/createCourse", isInstructor, createCourse)
router.post("/addChapter/:_id", isInstructor, addChapter)

// onChange ka use karke pata chal jayega konsi field mei change hai
// and then woh woh field inn updates wali functino mei bhej di jaayegi
router.patch("/update/:_id", isInstructor, updateCourse)
router.patch("/update/chapter/:_id",isInstructor, updateChapter)

router.delete("/delete/:_id",isInstructor, deleteCourse)
router.delete("/delete/chapter/:_id",isInstructor, deleteChapter)


router.post("/addContent/:_id", isInstructor,addContent)
router.patch("/update/content/:_id")
router.delete("/delete/content/:_id")



router.get("/:_id", getCourseById) // return the launched course 


module.exports = router;