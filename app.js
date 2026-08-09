import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routeProducts from "./routes/productRoute.js";
import routeCategory from "./routes/categoryRoute.js";
import routeAdmin from "./routes/adminRoute.js";
import bodyParser from "body-parser";
import dbClient from "./config/dbClient.js";
import { fileURLToPath } from "url";
import path from "path";
import adminModel from "./models/adminModel.js"; 

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://webhornera.netlify.app"
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/products", routeProducts);
app.use(
  "/static/categories",
  express.static(path.join(__dirname, "public/categories"))
);
app.use("/categories", routeCategory);
app.use("/admin", routeAdmin);

const initializeAdmin = async () => {
  try {
    const adminExists = await adminModel.adminExists();

    if (!adminExists) {
      await adminModel.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      });

      console.log("✅ Admin inicial creado");
    }
  } catch (error) {
    console.error("Error creando admin inicial:", error);
  }
};

const startServer = async () => {
  try {
    await initializeAdmin();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () =>
      console.log("Servidor activo en el puerto " + PORT)
    );

  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("SIGINT", async () => {
  dbClient.cerrarConexion();
  process.exit(0);
});