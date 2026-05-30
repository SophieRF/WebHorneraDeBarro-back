import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required: true,
            min: [1000, "El producto no puede valer menos de 1000"]
        },
        images: [{
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        available: {
            type: Boolean,
            required: true
        },
        isFeatured:{
            type: Boolean,
            default: false
        }
    }, { timestamps: true }
);

export default mongoose.model("Product", productSchema);