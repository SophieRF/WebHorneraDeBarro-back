import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../schemas/adminSchema.js";

class AdminModel {

    //CREAR
    async create(adminData) {
        const admin = new Admin(adminData);
        return await admin.save();
    }

    //GET BY EMAIL
    async getByEmail(email) {
        return await Admin.findOne({ email });
    }

    //GET BY ID
    async getById(id) {
        return await Admin.findById(id).select('-password');
    }

    //UPDATE EMAIL
    async updateEmail(id, newEmail) {
        return await Admin.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { email: newEmail } },
            { new: true, runValidators: true }
        ).select('-password');
    }

    //UPDATE CONTRASEÑA
    async updatePassword(id, newPassword) {
        const admin = await Admin.findById(id);
        if (!admin) return null;

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        await admin.save({ validateBeforeSave: true });
        return admin;
    }

    //EXISTE ADMIN
    async adminExists() {
        const count = await Admin.countDocuments();
        return count > 0;
    }
}

export default new AdminModel();