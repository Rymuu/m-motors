import { Router } from 'express'
import { uploadDocumentController, getDocumentsController } from '../controllers/document.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { upload } from '../lib/multer.js'

const router = Router({ mergeParams: true })

router.post('/', authMiddleware, upload.single('file'), uploadDocumentController)
router.get('/', authMiddleware, getDocumentsController)

export default router