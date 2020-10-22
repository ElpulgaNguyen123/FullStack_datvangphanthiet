var pool = require('../model/config/connectDb');

let queryActionAttributeDelete = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query(query, function (error, rows, fields) {
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

let queryAllAttribute = (query, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query(query, id ,function (error, rows, fields) {
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


let addExampleAttribute = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query(query, function (error, rows, fields) {
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

// get all slid
module.exports = {
    queryActionAttributeDelete,
    addExampleAttribute,
    queryAllAttribute
}