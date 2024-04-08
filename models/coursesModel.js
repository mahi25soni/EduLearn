const mongoose = require("mongoose")

const coursesSchema = new mongoose.Schema({
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
        type : Date,
        default : Date.now()
    },
    expriry_data : {
        type : Date
    },
    description : {
        type : String
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
            ref : "Chapters"
        }
    ]
    // Yaha enrollment wala bhi banana hai
    // and rating reviews wala bhi.
},
{
    timestamps : true
})

const Courses  = new mongoose.model("Courses", coursesSchema)



const chaptersSchema = new mongoose.Schema({
    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses"
    },
    name : {
        type : String,
        required : true
    },
    contentList : [
        {
            tupe 
        }
    ]
},
{
    timestamps : true
})
const Chapters = new mongoose.model("Chapters", chaptersSchema)


const contentSchema = new mongoose.Schema({
    chapter_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chapters"
    },
    sub_topic_name : String,
    video_url : {
        type : String // baad mei isko required karna hai mujhe
    },
    study_material_url : String // ye optional hi rakhunga, better rahega bc
},
{
    timestamps : true
})
const Content = new mongoose.model("Content", contentSchema)

module.exports = {
    Courses,
    Chapters,
    Content
}


