import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        image: {
            type: String,
            required: false
        },
        isFeatured: {
            type: Boolean,
            default: false,
            required: false
        }

    }, { timestamps: true }
);

export default mongoose.model("Category", categorySchema);