import { Request, Response } from 'express'
import Image from '../models/image'
import { APP_URL } from "../config/config"
import path from 'path'
import fs from 'fs'
import slugify from 'slugify'


const getAllImage = async (req: Request, res: Response) => {
    try {
        const images = await Image.find({})
        // .select({ _id: 0, __v: 0})

        let imagesDummy = [];

        for await (let image of images) {
            if (image.imageURL) {
                image.imageURL = APP_URL + image.imageURL;
            }
            imagesDummy.push(image);
        }

        console.log('images', images);


        return res.status(200).json({ error: false, data: imagesDummy })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }

}

const getImage = async (req: Request, res: Response) => {
    try {
        const imageId = req.params.id
        const findImage = await Image.findOne({ _id: imageId })
        if (!findImage) {
            return res.status(404).json({ error: true, msg: "Image not found" })
        }
        const image = await Image.findById({ _id: imageId }
        ).select({ _id: 0, __v: 0 })


        // Image.aggregate([
        //     {
        //         "$match": {
        //             _id: '612dfe2e95b1b329649c698d'
        //         }
        //     },
        //     // { $match: {  _id: imageId} },
        //     {
        //         "$set": {
        //             "imageURL": {
        //                 "$concat": [
        //                     APP_URL,
        //                     "$imageURL"
        //                 ]
        //             }
        //         }
        //     }
        // ]).then(result => {
        //     console.log(result);

        //     return res.status(200).json({
        //         success: true,
        //         data: result
        //     })
        // }).catch(error => {
        //     console.log(error);

        //     return res.status(400).json({
        //         success: false,
        //         error: error
        //     })
        // })


        return res.status(200).json({ error: false, data:image  })

    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }
}


const getImageBySlug = async (req: Request, res: Response) => {
    try {
        const imageSlug = req.params.slug
        const findImage = await Image.findOne({ slug: imageSlug })
        if (!findImage) {
            return res.status(404).json({ error: true, msg: "Image not found" })
        }
        const image = await Image.findById({ slug: imageSlug }).select({ _id: 0, __v: 0 })
        // Image.aggregate([
        //     {
        //         "$match": {
        //             _id: imageSlug
        //         }
        //     },
        //     // { $match: {  _id: imageId} },
        //     {
        //         "$set": {
        //             "imageURL": {
        //                 "$concat": [
        //                     APP_URL,
        //                     "$imageURL"
        //                 ]
        //             }
        //         }
        //     }
        // ]).then(result => {
        //     console.log(result);

        //     return res.status(200).json({
        //         success: true,
        //         data: result
        //     })
        // }).catch(error => {
        //     console.log(error);

        //     return res.status(400).json({
        //         success: false,
        //         error: error
        //     })
        // })
        return res.status(200).json({ error: false, data: image })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }
}

const addImage = async (req: Request, res: Response) => {
    try {

        if (req.file) {
            console.log(req.file)


        }

        if (!req.file) {
            return res.status(404).json({ error: true, msg: "File not found." });
        }

        const file = req.file.filename
        const ext = path.extname(file).split(".");
        const file_type = ext[1]
        // console.log('file_type', file_type);
        const file_name = file.replace(file_type, "").split('.')

        const image_title = file_name[0]
        console.log("image_title", image_title)

        let slug = slugify(image_title, { lower: true });

        let slug_exist = await Image.findOne({
            slug: slug
        });
        if (slug_exist) {
            slug = slug + "-" + Math.floor(Math.random() * 90 + 10);
        }

        const image = new Image({
            title: image_title,
            slug: slug,
            imageURL: req.file.path
        })
        await image.save()
        return res.status(201).json({ error: false, msg: "Add Succesfully", data: image })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }
}

// const addImageByLink = async (req: Request, res: Response) => {
//     try {

        

//         const file = req.file.filename
//         const ext = path.extname(file).split(".");
//         const file_type = ext[1]
//         // console.log('file_type', file_type);
//         const file_name = file.replace(file_type, "").split('.')

//         const image_title = file_name[0]
//         console.log("image_title", image_title)

//         let slug = slugify(image_title, { lower: true });

//         let slug_exist = await Image.findOne({
//             slug: slug
//         });
//         if (slug_exist) {
//             slug = slug + "-" + Math.floor(Math.random() * 90 + 10);
//         }

//         const image = new Image({
//             title: image_title,
//             slug: slug,
//             imageURL: req.file.path
//         })
//         await image.save()
//         return res.status(201).json({ error: false, msg: "Add Succesfully", data: image })
//     } catch (error) {
//         console.log(error);
//         return res.status(200).json({ error: true, msg: "Server Error" })
//     }
// }


const removeImage = async (req: Request, res: Response) => {
    try {
        const imageId = req.params.id
        const findImage = await Image.findOne({ _id: imageId })
        if (!findImage) {
            return res.status(404).json({ error: true, msg: "Image not found" })
        }
        const image = await Image.findByIdAndRemove({ _id: imageId })

        fs.unlinkSync(`${image?.imageURL}`);

        return res.status(200).json({ error: false, msg: "Delete Successfuly" })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }
}


export default {
    getAllImage,
    getImage,
    removeImage,
    getImageBySlug,
    addImage,
}