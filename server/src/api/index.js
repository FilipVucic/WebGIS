const router = require("express").Router();

const fireRouter = require("./fire");

router.use("/fire", fireRouter);

module.exports = router;
