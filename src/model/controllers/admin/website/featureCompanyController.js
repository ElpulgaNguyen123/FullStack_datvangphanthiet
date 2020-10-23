var pool = require('../../../config/connectDb');
var app = require('../../../config/app');
var service = require('../../../../services');
var multer = require('multer');
var { uuid } = require('uuidv4');
var { Transuccess } = require('../../../../../lang/vi');
var sharp = require('sharp');
var fs = require('fs');
var fsExtras = require('fs-extra');

// get all Blog
let getAllFeatureCompany = async (req, res, next) => {
    try {
        await pool.query('SELECT * FROM feature_company', function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/feature-company/features', {
                title: 'Lý do chọn Đất vàng',
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

// dẫn đến trang thêm blog
let addFeatureCompanyGet = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var user = req.user || {};
        res.render('admin/website/feature-company/feature-add', {
            title: 'Thêm Ưu đãi',
            errors: req.flash('Errors'),
            success: req.flash('Success'),
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
let addFeatureCompanyPost = (req, res, next) => {
    try {
        var arrayError = [],
            successArr = [];
        var queryNew = `INSERT INTO endow (title, image, description) VALUES ?`;
        var endowValues = [
            [req.body.endow_title,
                filename,
            req.body.endow_description]
        ];
        pool.query(queryNew, [endowValues], function (error, results, fields) {
            if (error) throw error;
            successArr.push(Transuccess.createSuccess('Blog'));
            req.flash('Success', successArr);
            res.redirect('/admin/endow');
        });
    } catch (error) {
        console.log(error);
        res.render('admin/notfound/notfound', {
            title: 'Trang Không tìm thấy'
        });
    }
}
let getFeatureCompanyEndow = async (req, res, next) => {
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
let postFeatureCompanyEndow = async (req, res, next) => {
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
    getAllFeatureCompany,
    addFeatureCompanyGet,
    addFeatureCompanyPost,
    getFeatureCompanyEndow,
    postFeatureCompanyEndow
};