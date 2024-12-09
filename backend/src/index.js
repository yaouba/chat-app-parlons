import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"


import authRoute from "./routes/auth.route.js"; 
import messageRoute from "./routes/message.route.js";

import { connectDB } from "./lib/db.lib.js";


dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoute);




const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});