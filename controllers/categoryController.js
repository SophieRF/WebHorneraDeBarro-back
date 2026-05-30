import categoryModel from "../models/categoryModel.js"
class categoryController {
    constructor() {

    }
    //CREAR
    async create(req, res) {
        try {
            const data = await categoryModel.create(req.body);
            res.status(201).json(data);

        } catch (error) {
            res.status(500).send(error);
        }
    }

    //GET ALL
    async getAll(req, res) {
        try {
            const data = await categoryModel.getAll();
            res.status(200).json(data);

        } catch (error) {
            res.status(500).send(error);
        }
    }

    //GET BY ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            const category = await categoryModel.getById(id);

            if (!category) {
                return res.status(404).json({ message: "Categoría no encontrada" });
            }

            res.status(200).json(category);

        } catch (error) {
            res.status(500).json({ message: "Error al traer la categoría" });
        }
    }

    //UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = await categoryModel.update(id, req.body);
            res.status(200).json(data);

        } catch (error) {
            res.status(500).send(error);
        }
    }

    //DELETE
    async delete(req, res) {
        try {
            const { id } = req.params;
            const data = await categoryModel.delete(id);
            res.status(206).json(data);

        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new categoryController();