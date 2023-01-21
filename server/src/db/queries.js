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
            ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb AS geom
        FROM podaci
        WHERE
            initialdat::timestamp >= $1::timestamp AND
            finaldate::timestamp <= $2::timestamp
        LIMIT 50`;
    const { rows } = await db.query(sql, [fromTime, toTime]);

    return rows;
}

async function getRastersBeforeFire(
    fireId,
    length = 5,
    intervalBeforeFire = "1 day"
) {
    const sql = `
        SELECT id, lst.rid, lst.datum
        FROM podaci, lst
        WHERE (id, datum) IN (
            SELECT id, datum
            FROM podaci, lst
            WHERE
                id = $1 AND
                datum <= (initialdat::timestamp - $2::interval)
            ORDER BY datum DESC
            LIMIT $3
        );`;
    const { rows } = await db.query(sql, [fireId, intervalBeforeFire, length]);

    return rows;
}

async function getRastersAfterFire(
    fireId,
    length = 5,
    intervalAfterFire = "1 day"
) {
    const sql = `
        SELECT id, lst.rid, lst.datum
        FROM podaci, lst
        WHERE (id, datum) IN (
            SELECT id, datum
            FROM podaci, lst
            WHERE
                id = $1 AND
                datum >= (finaldate::timestamp + $2::interval)
            ORDER BY datum ASC
            LIMIT $3
        );`;
    const { rows } = await db.query(sql, [fireId, intervalAfterFire, length]);

    return rows;
}

async function getBiomeForFireAndRasters(fireId, rids) {
    const sql = `
        SELECT (pvc).value, SUM((pvc).count) AS total
        FROM (
            SELECT id, place_name, ST_ValueCount(rast2,2) AS pvc
            FROM lst, podaci, ST_Clip(rast, geom) AS rast2
            WHERE podaci.id = $1 AND rid = ANY($2)
        ) AS foo
        GROUP BY (pvc).value
        ORDER BY (pvc).value;`;
    const { rows } = await db.query(sql, [fireId, [rids]]);

    return rows;
}

async function isBoltCaused(fireId) {
    const sql = `
        SELECT EXISTS (
            SELECT 1
            FROM munje2022 munja, podaci
            WHERE
                podaci.id = $1 AND
                vrijeme_munje BETWEEN
                    initialdat::timestamp - '1 days'::interval AND
                    initialdat::timestamp
                    AND
                ST_Overlaps(ST_Buffer(podaci.geom, 200), ST_Buffer(munja.geom, greska))
        );`;
    const { rows } = await db.query(sql, [fireId]);

    return rows[0].exists;
}

async function getBoltsBeforeFire(fireId) {
    const sql = `
        SELECT
            munja.id,
            vrijeme_munje,
            struja,
            ST_AsGeoJSON(ST_Transform(munja.geom, 4326))::jsonb AS geom
        FROM munje2022 munja, podaci
        WHERE
            podaci.id = $1 AND
            vrijeme_munje BETWEEN
                initialdat::timestamp - '1 days'::interval AND
                initialdat::timestamp
                AND
            ST_Overlaps(ST_Buffer(podaci.geom, 200), ST_Buffer(munja.geom, greska));`;
    const { rows } = await db.query(sql, [fireId]);

    return rows;
}

async function getPowerStationsForFire(fireId) {
    const sql = `
        SELECT
            power_station.id,
            type,
            ST_Distance(podaci.geom, power_station.geom) as distance,
            ST_AsGeoJSON(ST_Transform(power_station.geom, 4326))::jsonb AS geom
        FROM power_station, podaci
        WHERE
            podaci.id = $1 AND
            ST_Distance(podaci.geom, power_station.geom) < 2000;`;
    const { rows } = await db.query(sql, [fireId]);

    return rows;
}

async function getPowerTowersForFire(fireId) {
    const sql = `
        SELECT
            power_tower.id,
            type,
            ST_AsGeoJSON(ST_Transform(power_tower.geom, 4326))::jsonb AS geom
        FROM power_tower, podaci
        WHERE
            podaci.id = $1 AND
            ST_Contains(podaci.geom, power_tower.geom);`;
    const { rows } = await db.query(sql, [fireId]);

    return rows;
}

async function getPowerLinesForFire(fireId) {
    const sql = `
        SELECT
            power_line.id,
            power_line.name,
            type,
            voltage,
            ST_AsGeoJSON(ST_Transform(power_line.geom, 4326))::jsonb AS geom
        FROM power_line, podaci
        WHERE
            podaci.id = $1 AND
            ST_Intersects(podaci.geom, power_line.geom);`;
    const { rows } = await db.query(sql, [fireId]);

    return rows;
}

async function getRoadsForFire(fireId) {
    const sql = `
        SELECT
            road.id,
            road.name,
            road.reg_name,
            road.route,
            road.ref,
            ST_AsGeoJSON(ST_Transform(road.geom, 4326))::jsonb AS geom
        FROM road, podaci
        WHERE
            podaci.id = $1
            AND ST_Intersects(podaci.geom, road.geom);`;
    const { rows } = await db.query(sql, [fireId]);

    return rows;
}

module.exports = {
    getFiresInInterval,
    getRastersBeforeFire,
    getRastersAfterFire,
    getBiomeForFireAndRasters,
    isBoltCaused,
    getBoltsBeforeFire,
    getPowerStationsForFire,
    getPowerTowersForFire,
    getPowerLinesForFire,
    getRoadsForFire,
};
