
import express from 'express'
import file from '../middleware/fileHandle'

const router = express.Router()

import ImageController from '../controllers/image'

// import RoomController from '../controllers/roomController'

router.get('/all-images', ImageController.getAllImage)
router.post('/add-image', file.uploadFile, ImageController.addImage)
router.get('/image/:id', ImageController.getImage)
router.get('/get-image/:slug', ImageController.getImageBySlug)
router.delete('/remove-image/:id', ImageController.removeImage)

export default router;