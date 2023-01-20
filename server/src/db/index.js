const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

module.exports = {
    // query: async (text, params) => {
    //     const start = Date.now();
    //     const res = await pool.query(text, params);
    //     const duration = Date.now() - start;
    //     console.log("executed query", {
    //         text,
    //         duration,
    //         rows: res.rowCount,
    //     });
    //     return res;
    // },
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
};
