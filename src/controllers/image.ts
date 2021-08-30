import {Request, Response} from 'express'
import Image from '../models/image'


const getAllImage = async(req: Request, res: Response)=>{
    try {
        const images = await Image.find({}).select({ _id: 0, __v: 0})
        return res.status(200).json({ error: false, data: images })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: true, msg: "Server Error" })
    }

}


export default {
    getAllImage
}