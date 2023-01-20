const {
    getBoltsBeforeFire,
    getFiresInInterval,
    getSoilTypeForFireAndRasters,
    getRastersBeforeFire,
    getRastersAfterFire,
    getPowerTowersForFire,
    getPowerLinesForFire,
} = require("../db/queries");

const router = require("express").Router();

const biomes = [
    "Open ocean",
    "Irrigated cropland",
    "Rainfed cropland",
    "Mosaic cropland",
    "Mosaic vegetation",
    "Broadleaved evergreen forest",
    "Closed broadleaved deciduous forest",
    "Open broadleaved deciduous forest",
    "Closed needleaved forest",
    "Open needleaved forest",
    "Mixed forest",
    "Mosaic forest",
    "Mosaic grassland",
    "Shrubland",
    "Grassland",
    "Sparse vegetation",
    "Freshwater flooded forest",
    "Saltwater flooded forest",
    "Flooded vegetation",
    "Artificial surface",
    "Bare area unknown",
    "Bare area orhents",
    "Bare area sand",
    "Bare area calcids",
    "Bare area cambids",
    "Bare area orhels",
    "Water",
    "Snow and ice",
    "Unfilled",
];

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
            console.err(err);
            next(err);
        });
});

function calculateBiomsPercentage(soilType) {
    // for some reason no-values are classified 0, same as "Open ocean"
    const soil = soilType.filter((vt) => vt.value !== 0);
    const sum = soil.reduce((acc, vt) => acc + +vt.total, 0);
    const ret = {};
    soil.forEach(
        (vt) => (ret[biomes[vt.value]] = Math.round((+vt.total / sum) * 100))
    );

    return ret;
}

async function getBiomBeforeFire(fireId) {
    const ridsBefore = (await getRastersBeforeFire(fireId)).map((r) => r.rid);
    if (!ridsBefore.length) {
        return {};
    }

    const soilTypeBefore = await getSoilTypeForFireAndRasters(
        fireId,
        ridsBefore
    );

    return calculateBiomsPercentage(soilTypeBefore);
}

async function getBiomAfterFire(fireId) {
    const ridsAfter = (await getRastersAfterFire(fireId)).map((r) => r.rid);
    if (!ridsAfter.length) {
        return {};
    }

    const soilTypeAfter = await getSoilTypeForFireAndRasters(fireId, ridsAfter);

    return calculateBiomsPercentage(soilTypeAfter);
}

router.get("/:fireId/biome", async (req, res, next) => {
    const fireId = +req.params.fireId;

    try {
        const [before, after] = await Promise.all([
            getBiomBeforeFire(fireId),
            getBiomAfterFire(fireId),
        ]);

        res.json({
            before,
            after,
        });
    } catch (err) {
        console.err(err);
        next(err);
    }
});

router.get("/:fireId/bolts", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getBoltsBeforeFire(fireId)
        .then((bolts) => res.json(bolts.map(parseBolt)))
        .catch((err) => {
            console.err(err);
            next(err);
        });
});

router.get("/:fireId/power-towers", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getPowerTowersForFire(fireId)
        .then((towers) => res.json(towers))
        .catch((err) => {
            console.err(err);
            next(err);
        });
});

router.get("/:fireId/power-lines", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getPowerLinesForFire(fireId)
        .then((lines) => res.json(lines))
        .catch((err) => {
            console.err(err);
            next(err);
        });
});

module.exports = router;