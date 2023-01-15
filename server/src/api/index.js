const { getPodaci, getMunje } = require("../db/queries");

const router = require("express").Router();

router.get("/podaci", async (req, res) => {
    res.json(await getPodaci());
});

router.get("/munje", async (req, res) => {
    const munje = (await getMunje()).map((m) => {
        for (const f of ["pol", "tip", "gps_koordinate"]) {
            m[f] = m[f].replace(/^\"*/, "").replace(/\"*$/, "");
        }
        return m;
    });

    res.json(munje);
});

module.exports = router;
