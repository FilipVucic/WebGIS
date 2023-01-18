const {
    getSoilTypeForFire,
    getBoltsBeforeFire,
    getFiresInInterval,
} = require("../db/queries");

const router = require("express").Router();

function parseBolt(bolt) {
    for (const f of ["pol", "struja", "tip", "gps_koordinate"]) {
        if (bolt[f]) bolt[f] = bolt[f].replace(/\"+/g, "");
    }
    return bolt;
}

router.get("/", async (req, res, next) => {
    const fromTime =
        req.query.from ||
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // else week ago
    const toTime = req.query.to || "now";

    getFiresInInterval(fromTime, toTime)
        .then((fires) => res.json(fires))
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

router.get("/:fireId/soiltype", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getSoilTypeForFire(fireId)
        .then((soilType) => res.json(soilType))
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

router.get("/:fireId/bolts", async (req, res) => {
    const fireId = +req.params.fireId;

    getBoltsBeforeFire(fireId)
        .then((bolts) => res.json(bolts.map(parseBolt)))
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

module.exports = router;
