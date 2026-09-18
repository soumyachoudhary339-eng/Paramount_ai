import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"
import resumeRouter from "./routes/resume.route.js"
import authRouter from "./routes/auth.route.js"
import roadmapRouter from "./routes/roadmap.route.js"
import cors from "cors"
import { dbconnect } from "./config/db.js"

const app = express()
dbconnect()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
     credentials: true
}))

app.use("/api/auth",authRouter)
app.use("/api/resume",resumeRouter)
app.use("/api/roadmap",roadmapRouter)

export default app