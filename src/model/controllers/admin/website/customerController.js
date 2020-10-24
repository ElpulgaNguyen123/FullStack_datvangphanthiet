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
let getAllCustomeController = async (req, res, next) => {
    try {
        await pool.query('SELECT * FROM customers', function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/customers/customers', {
                title: 'Đánh giá của khách hàng',
                customers: rows,
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

let addCustomerGetController = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var user = req.user || {};
        res.render('admin/website/customers/add-customer', {
            title: 'Thêm đánh giá',
            errors: req.flash('Errors'),
            success: req.flash('Success'),
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
let addCustomerPostController = (req, res, next) => {
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
let getEditCustomerController = async (req, res, next) => {
    try {
        var customer_id = req.params.id;
        var arrayError = [],
            successArr = [];
        var query = `SELECT * FROM customers WHERE id = ?`;
        // Lấy tất cả sản phẩm và hiển thị ra table
        await pool.query(query, customer_id, function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/customers/edit-customer', {
                title: 'Chỉnh sửa lý do',
                customer: rows[0],
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
let postEditCustomerController = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        let arrayError = [],
            successArr = [];

        let queryUpdate = `
        UPDATE customers
        SET customer_name = ?, 
        customer_career = ?, 
        customer_evaluate = ?
        WHERE id = ?`
        var customerValues = [
            req.body.customer_name,
            req.body.customer_career,
            req.body.customer_evaluate,
            req.params.id
        ]
        await pool.query(queryUpdate, customerValues, function (error, results, fields) {
            if (error) throw error;
            successArr.push(Transuccess.saveSuccess('Đánh giá'));
            req.flash('Success', successArr);
            res.redirect('/admin/customer/edit-customer/' + req.params.id);
        });
    } catch (error) {
        console.log(error);
    }
}
let deleteCustomerController = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var arrayError = [],
            successArr = [];
        let querydelete = `DELETE customers WHERE id = ?`
        await pool.query(queryUpdate, req.params.id, function (error, results, fields) {
            if (error) throw error;
            successArr.push(Transuccess.saveSuccess('Lý do'));
            req.flash('Success', successArr);
            res.redirect('/admin/customers');
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllCustomeController,
    addCustomerGetController,
    addCustomerPostController,
    getEditCustomerController,
    postEditCustomerController,
    deleteCustomerController
};