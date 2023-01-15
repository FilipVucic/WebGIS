const db = require("./index");

async function getPodaci() {
    const sql = `
        SELECT
            id,
            initialdat AS start_date,
            finaldate AS end_date,
            area_ha,
            ST_AsGeoJSON(geom)::jsonb AS geom
        FROM podaci
        LIMIT 3;`;

    const { rows } = await db.query(sql);
    return rows;
}

async function getMunje() {
    const sql = `
    SELECT
        id,
        vrijeme_munje,
        pol,
        tip,
        struja,
        greska,
        gps_koordinate
    FROM munje2022
    LIMIT 10;`;

    const { rows } = await db.query(sql);
    return rows;
}

module.exports = {
    getPodaci,
    getMunje,
};
