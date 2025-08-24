const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors =require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const taskRoutes = require("./routes/tasks");
app.use("/api/tasks", taskRoutes);


app.get("/",(req,res) => {
    res.send("TaskSphere backend is working with MongoDB");
});

mongoose
.connect(process.env.MONGO_URI)
.then( ()=> {
    console.log("MongoDB connected");
    app.listen(3000, () => {
     console.log("Server is running on port 3000");
});
})
.catch( (err)  => {
    console.error("MongoDB connection failed.",err.message);
});