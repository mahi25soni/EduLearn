const {Course, Chapter, Content}  = require("../models/courseModel")
const cloudinary = require('cloudinary').v2

async function uploadOnMyCloud (filepath, course, chapter, sub_topic) {
    const options = {
        folder : `${course}/${chapter}/${sub_topic}`,
        resource_type : "auto",
    }
    return await cloudinary.uploader.upload(filepath, options);
}

async function deleteSingiFromMyCloud(cloud_path) {
    return await cloudinary.uploader.destroy
}
const addContent = async (req, res) => {
    try{

        const {sub_topic_name} = req.body;
        const chapter_id = req.params._id

        const chapterInfo = await Chapter.findOne({_id : chapter_id})
        console.log(chapterInfo)
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
            video_cloud_id : uploadLinks[0].public_id,
            study_material_url : uploadLinks[1] ? uploadLinks[1].secure_url : null,
            study_material_cloud_id : uploadLinks[1] ? uploadLinks[1].public_id : null
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

const updateContent = async (req, res) => {
    try{
        // This is made keeping "PATCH" request in mind
        const content_id = req.params._id
        
        const contentInfo = await Content.findOne({_id : content_id})
        const chapterInfo = await Chapter.findOne({_id : contentInfo.chapter_id})
        const courseInfo = await Course.findOne({_id : chapterInfo.course_id})
        
        const courseName = courseInfo.course_name
        const chapterName = chapterInfo.name
        const sub_topic_name = req.body.sub_topic_name ? req.body.sub_topic_name : contentInfo.sub_topic_name

        let content_of_cloud = [];
        let video;
        if(req.files['lecture_video'] && req.files['lecture_video'].length !== 0){
            video = req.files['lecture_video'][0]
            content_of_cloud.push(video);

            console.log("yaha tak toh chal rhaha hai")
            await cloudinary.uploader.destroy(contentInfo.video_cloud_id, {
                resource_type : "image"
            })
        }

        let material;
        if(req.files['lecture_material'] && req.files['lecture_material'].length !== 0){
            material = req.files['lecture_material'][0]
            content_of_cloud.push(material)
            await cloudinary.uploader.destroy(contentInfo.study_material_cloud_id, {
                resource_type : "image"
            })
        }

        const uploadLinks = []
        const uploadPromises = content_of_cloud.map(async (file) => {
            const link = await uploadOnMyCloud(file.path, courseName, chapterName, sub_topic_name);
            uploadLinks.push(link)
            return link;
        });

  
        await Promise.all(uploadPromises);

        const updated_content = await Content.findByIdAndUpdate(content_id, {
            sub_topic_name : sub_topic_name,
            video_url : video ? uploadLinks[0].secure_url : contentInfo.video_url,
            video_cloud_id : video ? uploadLinks[0].public_id : contentInfo.video_cloud_id ,
            study_material_url : material ? uploadLinks[1].secure_url : contentInfo.study_material_url,
            study_material_cloud_id : material ? uploadLinks[1].public_id : contentInfo.study_material_cloud_id
        }, {new : true})

        res.status(200).json({
            success: true,
            message: "New Content added!",
            date : updated_content
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

const deleteContent = async (req, res) => {
    try{
        const content_id = req.params._id
        const contentInfo = await Content.findOne({_id : content_id})

        const folder_name_array  = contentInfo.video_cloud_id.split("/")
        folder_name_array.pop();
        let cloud_folder_path = folder_name_array.join('/');

        await cloudinary.api.delete_resources_by_prefix(cloud_folder_path)
        console.log("kyaa hi masal hai bc")
        await cloudinary.api.delete_folder(cloud_folder_path)
        await Content.deleteOne({_id : content_id})


        res.status(200).json({
            success: true,
            message: "Content deleted!",
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
    addContent,
    updateContent,
    deleteContent
}