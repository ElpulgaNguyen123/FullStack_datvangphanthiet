var pool = require('../../config/connectDb');
var app = require('../../config/app');
var service = require('../../../services');
var { Transuccess } = require('../../../../lang/vi');
const policiesService = require('../../../services/policiesService');


// get all products
let FrgetAllPolicy = async (req, res, next) => {
    try {

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }

        await pool.query('SELECT * FROM policies', function (error, rows, fields) {
            if (error) throw error;
            res.render('datvangphanthiet/policies/policies', {
                title: 'Chính sách',
                policies: policies,
                policess : rows,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
                user: req.user
            });
        });
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/phap-ly');
    }
}

// lấy thông tin chỉnh sửa thương hiệu
let FrgetPolicyDetails = async (req, res, next) => {
    try {
        var policy_id = req.params.id;
        var arrayError = [],
            successArr = [];
        var query = `SELECT * FROM policies WHERE id = ?`;
        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }

        // Lấy tất cả sản phẩm và hiển thị ra table
        await pool.query(query, policy_id, function (error, rows, fields) {
            if (error) throw error;
            res.render('datvangphanthiet/policies/policy', {
                title: 'Chi tiết chính sách',
                policy: rows[0],
                policies : policies,
                user: req.user,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/phap-ly');
    }
}

module.exports = {
    FrgetAllPolicy,
    FrgetPolicyDetails
};