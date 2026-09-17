import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import { dbconnect } from "./config/db.js"

const app = express()
dbconnect()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
     credentials: true
}))


export default app