var pool = require('../../../config/connectDb');
var app = require('../../../config/app');
var service = require('../../../../services');
var multer = require('multer');
var { uuid } = require('uuidv4');
var { Transuccess } = require('../../../../../lang/vi');
var sharp = require('sharp');
var fs = require('fs');
var fsExtras = require('fs-extra');

// get all location
let getAlllocation = async (req, res, next) => {
    try {
        await pool.query('SELECT * FROM feature_company', function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/locations/locations', {
                title: 'Địa điểm',
                company_features: rows,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
                user: req.user
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

let getLocation = async (req, res, next) => {
    try {
        var company_feature_id = req.params.id;
        var arrayError = [],
            successArr = [];
        var query = `SELECT * FROM feature_company WHERE id = ?`;
        // Lấy tất cả sản phẩm và hiển thị ra table
        await pool.query(query, company_feature_id, function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/feature-company/feature-edit', {
                title: 'Chỉnh sửa lý do',
                company_feature: rows[0],
                user: req.user,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
// lấy thông tin chỉnh sửa gửi lên update lên server
let postLocation = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var arrayError = [],
            successArr = [];

        var queryUpdate = `
        UPDATE feature_company
        SET title = ?, 
        icon = ?, 
        feature_describe = ?
        WHERE id = ?`
        var companyFeatureValues = [
            req.body.company_feature_title,
            req.body.company_feature_icon,
            req.body.company_feature_describe,
            req.params.id
        ]
        await pool.query(queryUpdate, companyFeatureValues, function (error, results, fields) {
            if (error) throw error;
            successArr.push(Transuccess.saveSuccess('Lý do'));
            req.flash('Success', successArr);
            res.redirect('/admin/company-feature/edit-company-feature/' + req.params.id);
        });
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    getAlllocation,
    getLocation,
    postLocation,
};