import productModel from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

//SUBIR IMG A CLOUDINARY
const uploadImageToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(fileBuffer);
    });
};

class productController {
    constructor() {

    }
    //CREAR
    async create(req, res) {
        try {
            let imagesData = [];

            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(file =>
                    uploadImageToCloudinary(file.buffer)
                );
                const results = await Promise.all(uploadPromises);
                imagesData = results.map(result => ({
                    url: result.secure_url,
                    public_id: result.public_id
                }));
            }

            const product = {
                ...req.body,
                price: Number(req.body.price),
                available: req.body.available === "true",
                images: imagesData
            };

            const data = await productModel.create(product);
            res.status(201).json(data);

        } catch (error) {
            console.error("ERROR REAL:", error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error: error.message || error
            });
        }
    }

    //GET ALL
    async getAll(req, res) {
        try {
            const data = await productModel.getAll();
            res.status(201).json(data);

        } catch (error) {
            res.status(500).send(error);
        }
    }

    //GET BY ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const data = await productModel.getById(id);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    //UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;

            const productDB = await productModel.getById(id);
            if (!productDB) {
                return res.status(404).json({ msg: "Producto no encontrado" });
            }

            let imagesData = productDB.images || [];

            Object.keys(req.body).forEach(key => {
                if (req.body[key] === "" || req.body[key] === undefined) {
                    delete req.body[key];
                }
            });

            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(file =>
                    uploadImageToCloudinary(file.buffer)
                );

                const results = await Promise.all(uploadPromises);

                const newImages = results.map(result => ({
                    url: result.secure_url,
                    public_id: result.public_id
                }));

                imagesData = [...imagesData, ...newImages];
            }

            const productUpdated = {
                ...req.body,
                ...(req.body.price && { price: Number(req.body.price) }),
                ...(req.body.available && { available: req.body.available === "true" }),
                images: imagesData
            };

            const data = await productModel.update(id, productUpdated);
            res.status(200).json(data);

        } catch (error) {
            console.error("ERROR REAL:", error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error: error.message || error
            });
        }
    }


    //DELETE
    async delete(req, res) {
        try {
            const { id } = req.params;

            const productDB = await productModel.getById(id);
            if (!productDB) {
                return res.status(404).json({ msg: "No se encontró el producto" });
            }
            //Borrar todas las imagenes
            if (productDB.images && productDB.images.length > 0) {
                const deletePromises = productDB.images.map(img =>
                    cloudinary.uploader.destroy(img.public_id)
                );
                await Promise.all(deletePromises);
            }

            const data = await productModel.delete(id);
            res.status(200).json(data);

        } catch (error) {
            res.status(500).send(error);
        }
    }

    //DELETE una imagen
    async deleteImage(req, res) {
        try {
            const { id, public_id } = req.params;

            const productDB = await productModel.getById(id);
            if (!productDB) {
                return res.status(404).json({ msg: "Producto no encontrado" });
            }

            if (productDB.images.length <= 1) {
                return res.status(400).json({
                    msg: "No se puede eliminar la única imagen del producto"
                });
            }

            const imageExists = productDB.images.find(img => img.public_id === public_id);
            if (!imageExists) {
                return res.status(404).json({ msg: "Imagen no encontrada" });
            }

            await cloudinary.uploader.destroy(public_id);

            const updatedImages = productDB.images.filter(img => img.public_id !== public_id);

            const data = await productModel.update(id, { images: updatedImages });
            res.status(200).json(data);

        } catch (error) {
            console.error("ERROR:", error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error: error.message || error
            });
        }
    }
}

export default new productController();