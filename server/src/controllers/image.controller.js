import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Image } from "../models/image.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponce.js"
import { v2 as cloudinary } from "cloudinary"




const uploadImage = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path

    if (!imageLocalPath) {
        throw new ApiError(400, "Image file is missing")
    }

    

    const image = await uploadOnCloudinary(imageLocalPath)

    if (!image || !image.url) {
        throw new ApiError(500, "Problem while uploading the image to cloud")
    }

    const createdImage = await Image.create({
        imageFile: image.url,
        publicId: image.public_id,
        owner: req.user?._id
    })

    const safeImage = await Image.findById(createdImage._id)

    return res
        .status(200)
        .json(
            new ApiResponse(200, safeImage, "Image successfully uploaded")
        )
})

const getRandomImages = asyncHandler(async (req, res) => {

    try {
        const limit = Number(req.query.limit) || 12;
        const images = await Image.aggregate([
            {
                $sample: { size: limit }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    imageFile: 1,
                    createdAt: 1,
                    "user.username": 1
                }
            }
        ])

        return res
            .status(200)
            .json(
                new ApiResponse(200, images, "Random images are fetched successfully")
            )

    } catch (error) {
        console.error("Error fetching random images:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch images"
        });
    }
})

const getUserImages = asyncHandler(async (req, res) => {

    const images = await Image.find({ owner: req.user._id }).sort({ createdAt: -1 }).select("imageFile createdAt")

    const userDetails = {
        user: req.user,
        images,
        count: images.length
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, userDetails, "User's images and details are fetched successfully")
        )
})

const getImagesByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username }).select("username fullname avatar createdAt")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const images = await Image.find({ owner: user._id })
        .sort({ createdAt: -1 })
        .select("imageFile createdAt")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user,
                    images
                },
                "User images and data fatched successfully"
            )
        )

})

const deleteImage = asyncHandler(async (req, res) => {
    const { imageId } = req.params;


    const image = await Image.findById(imageId).select("+publicId")

    if (!image) {
        throw new ApiError(404, "Image not found");
    }

    if (image.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this image");
    }

    if (image.publicId) {
    const result = await cloudinary.uploader.destroy(image.publicId);

    if (result.result !== "ok") {
        throw new ApiError(500, "Failed to delete image from cloud");
    }
}

    await image.deleteOne();

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Image deleted successfully")
    )
})

export {
    uploadImage,
    getRandomImages,
    getUserImages,
    getImagesByUsername,
    deleteImage
}