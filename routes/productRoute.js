import express from "express";
import productController from "../controllers/productController.js"
import upload from "../middlewares/uploadMiddleware.js";

const route = express.Router();

route.post("/", upload.array("images", 5), productController.create); 
route.get("/:id", productController.getById);
route.get("/", productController.getAll);
route.put("/:id", upload.array("images", 5), productController.update);
route.delete("/:id", productController.delete);
route.delete("/:id/images/:public_id", productController.deleteImage);

export default route;