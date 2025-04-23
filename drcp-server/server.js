require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/error.handler");
const userRouter = require("./routes/user.route");
const incidentRouter = require("./routes/incident.route");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/incidents", incidentRouter);

app.use(errorHandler);

const start = async () => {
    try {
        const port = process.env.PORT;
        await mongoose.connect(process.env.MONGO);
        console.log("connected to db.");
        app.listen(port, () => {
            console.log(`server at http://localhost:${port}`);
        });
    } catch (error) {
        console.log("error starting the server");
        console.log(error);
    }
};
start();
