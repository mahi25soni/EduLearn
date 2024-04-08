const express = require("express")
const { createCourse, addChapter, updateCourse, updateChapter, deleteCourse, deleteChapter } = require("../controllers/courseController")
const router = express.Router()



router.post("/createCourse", createCourse)
router.post("/addChapter/:_id", addChapter)

// onChange ka use karke pata chal jayega konsi field mei change hai
// and then woh woh field inn updates wali functino mei bhej di jaayegi
router.patch("/update/:_id", updateCourse)
router.patch("/update/chapter/:_id", updateChapter)

router.delete("/delete/:_id", deleteCourse)
router.delete("/delete/chapter/:_id", deleteChapter)


router.post("/addContent/:_id")
router.patch("/update/content/:_id")
router.delete("/delete/content/:_id")



router.get("/_id") // return the launched course 


module.exports = router;