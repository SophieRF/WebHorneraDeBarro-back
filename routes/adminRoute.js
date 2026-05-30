import express from "express";
import adminController from "../controllers/adminController.js";
import {verifyAdmin} from "../middlewares/authMiddleware.js"

const route = express.Router();

route.post("/login", adminController.login);

route.get("/verificar", verifyAdmin, adminController.verify);
route.put("/cambiar-usuario", verifyAdmin, adminController.updateAdmin);

export default route;