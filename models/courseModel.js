const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    course_name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    launch_date : {
        type : Date, // Launch date is not needed to be Date.now(), pehle koi banayega, material daalega and all, tab jaake hoga woh lauch, so jab koi "launch" pei click karega, tab jaake launch likha aana chahiye ismpei, 
    },
    expriry_data : {
        type : Date
    },
    description : {
        type : String
    },
    banner : {
        type : String, // image link string chahiye hogi hamme banner ke liye
    },
    netDuration : {
        type : Number // Joh videos daali jaayegi, unko total sum time.
    },
    students : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Users"
        }
    ],
    chapters : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Chapter"
        }
    ],
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "CourseReview"
        }
    ],
    rating : {
        type : Number,
        default : 0,
    },
    raters : {
        type : Number,
        default : 0 
    }
    // Yaha enrollment wala bhi banana hai
},
{
    timestamps : true
})

const Course  = new mongoose.model("Course", courseSchema)



const chaptersSchema = new mongoose.Schema({
    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    },
    name : {
        type : String,
        required : true
    },
    contentList : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Content" 
        }
    ]
},
{
    timestamps : true
})
const Chapter = new mongoose.model("Chapter", chaptersSchema)


const contentSchema = new mongoose.Schema({
    chapter_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chapter"
    },
    sub_topic_name : String,
    video_url : {
        type : String // baad mei isko required karna hai mujhe
    },
    video_cloud_id : String,
    study_material_url : String,// ye optional hi rakhunga, better rahega bc
    study_material_cloud_id : String
},
{
    timestamps : true
})
const Content = new mongoose.model("Content", contentSchema)

module.exports = {
    Course,
    Chapter,
    Content
}


