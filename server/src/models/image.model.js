import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const imageSchema = new Schema(
    {
        imageFile:{
            type: String, //cloudinary url
            required: true
        },
        publicId: {
            type: String,
            select: false
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)



export const Image = mongoose.model("Image", imageSchema)
