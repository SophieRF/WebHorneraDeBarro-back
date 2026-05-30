import "dotenv/config";
import mongoose from "mongoose";
import "dotenv/config";

class dbClient {
    constructor(){
        this.connectDB();
    }

    async connectDB() {
        const queryString = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/apiHorneraDeBarro?`;
        await mongoose.connect(queryString);
    }

    async cerrarConexion() {
        try {
            await mongoose.disconnect();
            console.log("Conexión a la base de datos cerrada");
        } catch (error) {
            console.error("Error al cerrar la conexión:", error);
        }
    }

}

export default new dbClient;