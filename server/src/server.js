const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const middlewares = require("./middlewares");
const routerApi = require("./api");

const app = express();

app.use(express.json());
app.set("json spaces", 2);
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api", routerApi);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(PORT, () => console.log(`Listenining on ${BASE_URL}`));
