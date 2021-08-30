
import express from 'express'

const router = express.Router()

import ImageController from '../controllers/image'

// import RoomController from '../controllers/roomController'

router.get('/all-images', ImageController.getAllImage)

export default router;