import { Request, Response } from 'express'
import Image from '../models/image'
import { APP_URL } from "../config/config"
import path from 'path'
import fs from 'fs'



const getAllImage = (req: Request, res: Response) => {

    const perPage = 4
    let page = parseInt(req.query.page as string) || 0 as any


    Image.find()
        .limit(perPage)
        .skip(perPage * page)
        .sort('-createdAt')
        .exec(function (err, images) {
            Image.count()
                .exec(function (err, count) {
                    if (err) { res.status(500).json({ error: true, msg: "Server Error" }); return; };
                    res.status(200).json({
                        image_list: images,
                        page: page,
                        pages: Math.ceil(count / perPage)
                    });

                })
        })


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

        let { imageFullURL } = req.body

        if (imageFullURL == undefined || imageFullURL == null || imageFullURL == '') {
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

        if (image?.imageURL) {
            fs.unlinkSync(`${image?.imageURL}`);
        }

        return res.status(200).json({ error: false, msg: "Delete Successfuly" })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }
}

const filterData = async (req: Request, res: Response) => {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    // try {
    Image.aggregate([

        { $match: { 'createdAt': { $gt: d } } },
        {

            $addFields: {
                createdAtDate: {
                    $toDate: "$createdAt"
                },

            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAtDate"
                    }
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                count: 1,
                date: "$_id",
                _id: 0
                
            }
        }
    ])
        .exec(function (err, image) {
           const result = Object.fromEntries(Object
                .entries(image.reduce((r, { date, count }) => {
                    r[date] ??= 0;
                    r[date] += count || -1;
                    return r;
                }, {}))
                .map(([k, v]) => [k, v])
            );
        
            if (err) { res.status(500).json({ error: true, msg: "Server Error" }); return; };
            res.status(200).json({
                error: false,
                last_week: image,
                result: result

            });
        })

    // console.log(userData)
    // return res.status(200).json({ error: false, data: data })

    // } catch (error) {
    //     console.log(error);
    //     return res.status(200).json({ error: true, msg: "Server Error" })
    // }
}





export default {
    getAllImage,
    getImage,
    removeImage,
    addImage,
    addImageByLink,
    filterData
}