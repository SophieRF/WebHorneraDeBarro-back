import mongoose from "mongoose";
import Product from "../schemas/productSchema.js";
import Category from "../schemas/categorySchema.js";

class ProductModel {

    //CREAR
    async create(product) {
        const newProduct = await Product.create(product);

        await Category.findByIdAndUpdate(
            newProduct.category,
            { $push: { products: newProduct._id } }
        );

        return newProduct.populate("category", "_id name");
    }

    //GET ALL
    async getAll() {
        return await Product.find().populate("category", "_id name");
    }

    //GET BY ID
    async getById(id) {
        return await Product.findById(id).populate("category", "_id name");
    }

    //UPDATE
    async update(id, product) {
        const currentProduct = await Product.findById(id);

        if (
            product.category &&
            currentProduct.category?.toString() !== product.category.toString()
        ) {
            await Category.findByIdAndUpdate(
                currentProduct.category,
                { $pull: { products: currentProduct._id } }
            );
            await Category.findByIdAndUpdate(
                product.category,
                { $push: { products: currentProduct._id } }
            );
        }

        return await Product.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: product },
            { new: true }
        ).populate("category", "_id name");
    }

    //DELETE
    async delete(id) {
        const product = await Product.findById(id);

        await Category.findByIdAndUpdate(
            product.category,
            { $pull: { products: product._id } }
        );

        return await Product.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
    }
}

export default new ProductModel;