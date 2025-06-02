import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.get('/',(req,res) => {
    res.send("Hello world!");
})

db();

app.use("/api/v1/users",userRoutes);

app.listen(port,() => {
    console.log(`Listening on 127.0.0.1:${port}`);
})