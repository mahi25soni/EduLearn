const {Course, Chapter, Content}  = require("../models/courseModel")
const cloudinary = require('cloudinary').v2

async function uploadOnMyCloud (filepath, course, chapter, sub_topic) {
    const options = {
        folder : `${course}/${chapter}/${sub_topic}`,
        resource_type : "auto",
    }
    return await cloudinary.uploader.upload(filepath, options);
}

const addContent = async (req, res) => {
    try{

        const {sub_topic_name} = req.body;
        const chapter_id = req.params._id

        const chapterInfo = await Chapter.findOne({_id : chapter_id})
        const courseInfo = await Course.findOne({_id : chapterInfo.course_id})

        const courseName = courseInfo.course_name
        const chapterName = chapterInfo.name

        let content_of_cloud = [];
        const video = req.files['lecture_video'][0]
        content_of_cloud.push(video)

        let material;
        if(req.files['lecture_material'] && req.files['lecture_material'].length !== 0){
            material = req.files['lecture_material'][0]
            content_of_cloud.push(material)
        }

        const uploadLinks = []
        const uploadPromises = content_of_cloud.map(async (file) => {
            const link = await uploadOnMyCloud(file.path, courseName, chapterName, sub_topic_name);
            uploadLinks.push(link)
            return link;
        });

  
        await Promise.all(uploadPromises);

        new_content = await Content.create({
            chapter_id : chapter_id ,
            sub_topic_name : sub_topic_name,
            video_url : uploadLinks[0].secure_url,
            study_material_url : uploadLinks[1] ? uploadLinks[1].secure_url : null
        });

                // Append content id to chapter
        await Chapter.findByIdAndUpdate({_id : chapter_id}, {$push : {contentList : new_content._id}})
        res.status(200).json({
            success: true,
            message: "New Content added!",
            date : new_content
        });





    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

module.exports = {
    addContent
}