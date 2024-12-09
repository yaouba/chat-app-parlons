import express from "express";
import dotenv from "dotenv";


import authRoute from "./routes/auth.route.js"; 

import { connectDB } from "./lib/db.lib.js";


dotenv.config();


const app = express();

app.use(express.json());

app.use('/api/auth', authRoute);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});