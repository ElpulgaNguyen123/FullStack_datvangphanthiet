var pool = require('../model/config/connectDb');

// get all slider
let getAllLocations = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query(query, function (error, rows, fields) {
                if (error) throw error;
                if (!rows[0]) {
                    return resolve(rows);
                }
                return resolve(rows);
            })
        } catch (error) {
            console.log('caught', error);
        }
    })
}


let queryActionLocationsParams = (query, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query(query, params, function (error, rows, fields) {
                if (error) throw error;
                if (!rows[0]) {
                    resolve(rows);
                }
                return resolve(rows);
            })
        } catch (error) {
            console.log('caught', error);
        }
    })
}

module.exports = {
    getAllLocations,
    queryActionLocationsParams
}