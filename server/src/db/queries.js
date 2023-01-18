const db = require("./index");

async function getFiresInInterval(fromTime, toTime) {
    const sql = `
    SELECT
        id,
        initialdat AS initialdate,
        finaldate,
        area_ha,
        place_name,
        providence,
        ST_AsGeoJSON(geom)::jsonb AS geom
    FROM podaci
    WHERE initialdat::timestamp >= $1::timestamp
        AND finaldate::timestamp <= $2::timestamp
    LIMIT 50`;
    const { rows } = await db.query(sql, [fromTime, toTime]);

    return rows;
}

async function getRasterIdBeforeFire(fireId, intervalBeforeFire = "1 day") {
    const sql = `
    SELECT id, lst.rid, lst.datum
    FROM podaci, lst
    WHERE (id, datum) IN (
        SELECT id, MAX(datum) datum
        FROM podaci, lst
        WHERE id = $1
            AND datum <= (initialdat::timestamp - $2::interval)
        GROUP BY id
    );`;
    const { rows } = await db.query(sql, [fireId, intervalBeforeFire]);

    if (rows.length) return rows[0].rid;
    else throw Error(`Can't find raster before fireId=${fireId}`);
}

async function getSoilTypeForFire(fireId) {
    const rid = await getRasterIdBeforeFire(fireId);

    const sql = `
    SELECT (pvc).value, SUM((pvc).count) AS total
    FROM (
        SELECT id, place_name, ST_ValueCount(rast2,2) AS pvc
        FROM lst, podaci, ST_Clip(rast, geom) AS rast2
        WHERE podaci.id = $1 AND rid = $2
    ) AS foo
    GROUP BY (pvc).value
    ORDER BY (pvc).value;`;
    const { rows } = await db.query(sql, [fireId, rid]);

    return rows;
}

async function getBoltsBeforeFire(fireId) {
    const sql = `
    SELECT
        munja.id,
        vrijeme_munje,
        struja,
        ST_AsGeoJSON(munja.geom)::jsonb AS geom
    FROM munje2022 munja, podaci
    WHERE
        podaci.id = $1
        AND vrijeme_munje BETWEEN
            initialdat::timestamp - '1 days'::interval
            AND initialdat::timestamp
        AND ST_Overlaps(ST_Buffer(podaci.geom, 200), ST_Buffer(munja.geom, greska));`;

    const { rows } = await db.query(sql, [fireId]);
    return rows;
}

module.exports = {
    getFiresInInterval,
    getSoilTypeForFire,
    getBoltsBeforeFire,
};
