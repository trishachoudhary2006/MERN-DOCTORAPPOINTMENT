import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import cors from "cors";

dotenv.config()

const app = express();
const port = process.env.PORT|| 3000

app.use(cors(
    {
        origin : 'http://localhost:5173'
    }
))
//  app.get("/", (req,res) => {
//     res.status(200).json("Hello")
//     console.log("hello")
    

//  })
// // // app.listen(port,() => {
// // //     console.log(`http://localhost:${port}`)

// // // })
app.use(express.json())
app.use("/appointments" , appointmentRoutes)
connectDB().then(() =>{
    app.listen(port,() =>{
        console.log(`http://localhost:${port}/appointments`)
    })
})