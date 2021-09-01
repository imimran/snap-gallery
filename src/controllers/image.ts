import { Request, Response } from 'express'
import Image from '../models/image'
import { APP_URL } from "../config/config"
import path from 'path'
import fs from 'fs'



const getAllImage = async (req: Request, res: Response) => {
    try {
        const images = await Image.find({})
        // .select({ _id: 0, __v: 0})

        // let imagesDummy = [];

        // for await (let image of images) {
        //     if (image.imageURL) {
        //         image.imageURL = APP_URL + image.imageURL;
        //     }
        //     imagesDummy.push(image);
        // }

        // console.log('images', images);


        return res.status(200).json({ error: false, data: images })
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

        return res.status(200).json({ error: false, data:image  })

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
 
        const file_name = file.replace(file_type, "").split('.')

        const image_title = file_name[0]
        console.log("image_title", image_title)

        const image = new Image({
            title: image_title,
            imageURL: req.file.path,
            imageFullURL: APP_URL + req.file.path
        })
        await image.save()
        return res.status(201).json({ error: false, msg: "Add Succesfully", data: image })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }
}

const addImageByLink = async (req: Request, res: Response) => {
    try {

        let {imageFullURL} = req.body

        if(imageFullURL== undefined || imageFullURL== null || imageFullURL== ''){
            return res.status(401).json({ error: true, msg: "Image URL requried" })
        }

        const image = new Image({
            imageFullURL,
        })
        await image.save()
        return res.status(201).json({ error: false, msg: "Add Succesfully", data: image })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }
}   



const removeImage = async (req: Request, res: Response) => {
    try {
        const imageId = req.params.id
        const findImage = await Image.findOne({ _id: imageId })
        if (!findImage) {
            return res.status(404).json({ error: true, msg: "Image not found" })
        }
        const image = await Image.findByIdAndRemove({ _id: imageId })
        
        if(image?.imageURL){
        fs.unlinkSync(`${image?.imageURL}`);
        }

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
    addImage,
    addImageByLink
}