var pool = require('../../config/connectDb');
var app = require('../../config/app');
var service = require('../../../services');
var { Transuccess } = require('../../../../lang/vi');


// get all products
let getAllPolicy = async (req, res, next) => {
    try {
        await pool.query('SELECT * FROM policies', function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/policies/policies', {
                title: 'Chính sách',
                policies: rows,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
                user: req.user
            });
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/brands');
    }
}

let addPolicyGet = (req, res, next) => {
    res.render('admin/policies/add-policy', {
        title: 'Thêm chính sách',
        user: req.user,
        errors: req.flash('Errors'),
        success: req.flash('Success'),
    });
}

let addPolicyPost = (req, res, next) => {
    try {
        var arrayError = [],
            successArr = [];

        let queryNewPolicy = "INSERT INTO policies (policy_name, policy_slug, policy_content) VALUES ?";
        var policyValues = [
            [req.body.policy_name,
            req.body.policy_slug,
            req.body.policy_content]
        ];
        pool.query(queryNewPolicy, [policyValues], function (error, results, fields) {
            if (error) throw error;
            successArr.push(Transuccess.createSuccess('Chính sách'));
            req.flash('Success', successArr);
            res.redirect('/admin/policies');
        });
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/policies');
    }
}
// lấy thông tin chỉnh sửa thương hiệu
let getEditPolicy = async (req, res, next) => {
    try {
        var policy_id = req.params.id;
        var arrayError = [],
            successArr = [];
        var query = `SELECT * FROM policies WHERE id = ?`;
        // Lấy tất cả sản phẩm và hiển thị ra table
        await pool.query(query, policy_id, function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/policies/edit-policy', {
                title: 'Chỉnh sửa chính sách',
                policy: rows[0],
                user: req.user,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/brands');
    }
}
// lấy thông tin chỉnh sửa thương hiệu gửi lên update lên server
let postEditPolicy = async (req, res, next) => {

    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var arrayError = [],
            successArr = [];
        var queryUpdate = `
            UPDATE policies
            SET policy_name = ?, 
            policy_slug = ?, 
            policy_content = ?
            WHERE id = ?`
        var policyValues = [
            req.body.policy_name,
            req.body.policy_slug,
            req.body.policy_content,
            req.params.id
        ];
        await pool.query(queryUpdate, policyValues, function (error, results, fields) {
            if (error) {
                arrayError.push('Có lỗi xảy ra');
                req.flash('errors', arrayError);
                res.redirect('/admin/policy/edit-policy/' + req.params.id);
            };
            successArr.push(Transuccess.saveSuccess('chính sách'));
            req.flash('Success', successArr);
            res.redirect('/admin/policy/edit-policy/' + req.params.id);
        });
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/policy/edit-policy/' + req.params.id);
    }
}
// xóa dữ liệu của 1 brand
let postDeletePolicy = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var arrayError = [],
            successArr = [];
        let policy_id = req.params.id
        var querydeletePolicy = `
        DELETE FROM 
        policies 
        WHERE id = ${policy_id}`
        pool.query(querydeletePolicy, function (error, results, fields) {
            if (error) {
                arrayError.push('Có lỗi xảy ra');
                req.flash('errors', arrayError);
                res.redirect('/admin/policies');
            };
            successArr.push(Transuccess.deleteSuccess('chính sách'));
            req.flash('Success', successArr);
            res.redirect('/admin/policies');
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/policies');
    }
}

module.exports = {
    getAllPolicy,
    addPolicyGet,
    addPolicyPost,
    postEditPolicy,
    getEditPolicy,
    postDeletePolicy
};