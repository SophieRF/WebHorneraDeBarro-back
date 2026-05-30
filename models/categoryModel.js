import mongoose from "mongoose";
import Category from "../schemas/categorySchema.js"

class CategoryModel {

    //CREAR
    async create(category) {
        return await Category.create(category);
    }

    //GET ALL
    async getAll() {
        return await Category.find().populate({
            path: "products",
            select: "_id name price images available isFeatured"
        });
    }

    //GET BY ID
    async getById(id) {
        return await Category.findById(id).populate({
            path: "products",
            select: "_id name price images available isFeatured"
        });
    }


    //UPDATE
    async update(id, category) {
        return await Category.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: category },
            { new: true, runValidators: true }

        ).populate("products");
    }

    //DELETE
    async delete(id) {
        return await Category.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
    }
}

export default new CategoryModel;