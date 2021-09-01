
import express from 'express'
import file from '../middleware/fileHandle'

const router = express.Router()

import ImageController from '../controllers/image'


router.get('/all-images', ImageController.getAllImage)
router.post('/add-image', file.uploadFile, ImageController.addImage)
router.post('/add-image-url', file.form, ImageController.addImageByLink)
router.get('/image/:id', ImageController.getImage)
router.delete('/remove-image/:id', ImageController.removeImage)

export default router;