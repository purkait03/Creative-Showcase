import { Router } from "express";
import {
    uploadImage,
    getRandomImages,
    getUserImages,
    getImagesByUsername,
    deleteImage
} from "../controllers/image.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/random").get(getRandomImages)
router.route("/profile/:username").get(getImagesByUsername)

// Secure routes
router.route("/upload").post(verifyJWT, upload.single("image"), uploadImage)
router.route("/my-images").get(verifyJWT, getUserImages)
router.route("/:imageId").delete(verifyJWT, deleteImage);


export default router