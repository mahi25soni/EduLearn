const express = require("express")
const router = express.Router()

const { createCourse, addChapter, updateCourse, updateChapter, deleteCourse, deleteChapter, getCourseById } = require("../controllers/courseController")
const { addContent, updateContent, deleteContent } = require("../controllers/contentContoller")
const {isAdmin, isInstructor, isStudent} = require("../middlewares/userAuth")

const multer = require("multer")
const upload = multer({dest : 'uploads/'})
const content_files = upload.fields([{name : 'lecture_video', maxCount : 1}, {name : 'lecture_material', maxCount : 1}])


router.post("/createCourse", isInstructor, createCourse)
router.post("/addChapter/:_id", isInstructor, addChapter)

// onChange ka use karke pata chal jayega konsi field mei change hai
// and then woh woh field inn updates wali functino mei bhej di jaayegi
router.patch("/update/:_id", isInstructor, updateCourse)
router.patch("/update/chapter/:_id",isInstructor, updateChapter)

router.delete("/delete/:_id",isInstructor, deleteCourse)
router.delete("/delete/chapter/:_id",isInstructor, deleteChapter)


router.post("/addContent/:_id", isInstructor, content_files, addContent)
router.patch("/update/content/:_id", isInstructor, content_files, updateContent)
router.delete("/delete/content/:_id", isInstructor, deleteContent)



router.get("/:_id", getCourseById) // return the launched course 


module.exports = router;