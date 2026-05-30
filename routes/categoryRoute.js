import express from "express";
import categoryController from "../controllers/categoryController.js"
const route = express.Router();

route.post("/", categoryController.create);
route.get("/:id", categoryController.getById);
route.get("/", categoryController.getAll);
route.put("/:id", categoryController.update);
route.delete("/:id", categoryController.delete);

export default route;