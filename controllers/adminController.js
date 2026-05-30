import adminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import Admin from "../schemas/adminSchema.js";

class adminController {
    constructor() { }

    //LOGIN
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Email y contraseña son requeridos"
                });
            }

            const admin = await adminModel.getByEmail(email);

            if (!admin) {
                return res.status(401).json({
                    message: "Credenciales inválidas"
                });
            }

            const isCorrectPassword = await admin.comparePassword(password);

            if (!isCorrectPassword) {
                return res.status(401).json({
                    message: "Credenciales inválidas"
                });
            }

            const token = jwt.sign(
                { id: admin._id, email: admin.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.status(200).json({
                message: "Login Exitoso",
                token,
                admin: {
                    id: admin._id,
                    email: admin.email
                }
            });

        } catch (error) {
            console.log("Error en el login:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    //VERIFICAR TOKEN
    async verify(req, res) {
        try {
            const admin = await adminModel.getById(req.adminId);

            if (!admin) {
                return res.status(404).json({
                    message: "Admin no encontrado"
                });
            }

            res.status(200).json({
                admin: {
                    id: admin._id,
                    email: admin.email
                }
            });
        } catch (error) {
            console.error("Error al verificar: ", error);
            res.status(500).json({
                message: "Error al verificar sesión"
            });
        }
    }

    //UPDATE ADMIN
    async updateAdmin(req, res) {
        try {
            const { email, currentPassword, newPassword } = req.body;
            const admin = await Admin.findById(req.adminId);

            if (!admin) {
                return res.status(404).json({
                    message: "Admin no encontrado"
                });
            }
            // Update email
            if (email && email !== admin.email) {

                const emailExists = await Admin.findOne({ email });
                if (emailExists) {
                    return res.status(400).json({
                        message: "Ese email ya está en uso"
                    });
                }

                admin.email = email;
            }

            // Update password
            if (newPassword) {

                if (!currentPassword) {
                    return res.status(400).json({
                        message: "Debes ingresar la contraseña actual"
                    });
                }

                const isPasswordCorrect = await admin.comparePassword(currentPassword);

                if (!isPasswordCorrect) {
                    return res.status(401).json({
                        message: "Contraseña actual incorrecta"
                    });
                }

                if (newPassword.length < 8) {
                    return res.status(400).json({
                        message: "La contraseña debe tener al menos 8 caracteres"
                    });
                }

                admin.password = newPassword;
            }
            await admin.save();

            // Update Token
            const newToken = jwt.sign(
                { id: admin._id, email: admin.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            res.status(200).json({
                message: "Perfil actualizado correctamente",
                token: newToken,
                admin: {
                    id: admin._id,
                    email: admin.email
                }
            });

        } catch (error) {
            console.error("Error actualizando perfil: ", error);
            res.status(500).json({
                message: "Error al actualizar perfil"
            });
        }
    }

}

export default new adminController();