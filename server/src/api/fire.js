const {
    getBoltsBeforeFire,
    getFiresInInterval,
    getBiomeForFireAndRasters,
    getRastersBeforeFire,
    getRastersAfterFire,
    getPowerTowersForFire,
    getPowerLinesForFire,
    getRoadsForFire,
    getPowerStationsForFire,
    isBoltCaused,
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
    bolt["struja"] = +bolt["struja"];

    return bolt;
}

function wrapAsFeature(a) {
    const { id, geom, ...properties } = a;
    return {
        type: "Feature",
        id,
        properties,
        geometry: geom,
    };
}

function wrapAsFeatureCollection(as) {
    return {
        type: "FeatureCollection",
        features: as.map(wrapAsFeature),
    };
}

router.get("/", async (req, res, next) => {
    const fromTime = req.query.from || "2022-08-06";
    const toTime = req.query.to || "2022-08-13";

    try {
        const fires = await getFiresInInterval(fromTime, toTime);

        for (const fire of fires) {
            fire.boltCaused = await isBoltCaused(fire.id);
        }

        res.json(wrapAsFeatureCollection(fires));
    } catch (err) {
        console.error(err);
        next(err);
    }
});

function calculateBiomsPercentage(biome) {
    // for some reason no-values are classified 0, same as "Open ocean"
    const soil = biome.filter((vt) => vt.value !== 0);
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

    const biomeBefore = await getBiomeForFireAndRasters(fireId, ridsBefore);

    return calculateBiomsPercentage(biomeBefore);
}

async function getBiomAfterFire(fireId) {
    const ridsAfter = (await getRastersAfterFire(fireId)).map((r) => r.rid);
    if (!ridsAfter.length) {
        return {};
    }

    const biomeAfter = await getBiomeForFireAndRasters(fireId, ridsAfter);

    return calculateBiomsPercentage(biomeAfter);
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
        console.error(err);
        next(err);
    }
});

router.get("/:fireId/bolts", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getBoltsBeforeFire(fireId)
        .then((bolts) => bolts.map(parseBolt))
        .then(wrapAsFeatureCollection)
        .then((bolts) => res.json(bolts))
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.get("/:fireId/power-stations", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getPowerStationsForFire(fireId)
        .then(wrapAsFeatureCollection)
        .then((station) => res.json(station))
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.get("/:fireId/power-towers", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getPowerTowersForFire(fireId)
        .then(wrapAsFeatureCollection)
        .then((towers) => res.json(towers))
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.get("/:fireId/power-lines", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getPowerLinesForFire(fireId)
        .then(wrapAsFeatureCollection)
        .then((lines) => res.json(lines))
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.get("/:fireId/roads", async (req, res, next) => {
    const fireId = +req.params.fireId;

    getRoadsForFire(fireId)
        .then(wrapAsFeatureCollection)
        .then((roads) => res.json(roads))
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

module.exports = router;
