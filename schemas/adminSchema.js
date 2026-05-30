import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Encriptar password
adminSchema.pre("save", async function() {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparar contraseñas para el login
adminSchema.methods.comparePassword = async function(passwordIngresado) {
  if (!passwordIngresado) {
    throw new Error("Password ingresado es undefined");
  }
  if (!this.password) {
    throw new Error("Password en base de datos es undefined");
  }

  return await bcrypt.compare(passwordIngresado, this.password);
};

export default mongoose.model('Admin', adminSchema);