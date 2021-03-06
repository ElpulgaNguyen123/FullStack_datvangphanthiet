var pool = require('../../config/connectDb');
var app = require('../../config/app');
var service = require('../../../services');
var { Transuccess } = require('../../../../lang/vi');
const policiesService = require('../../../services/policiesService');


// get all products
let FrgetAllPolicy = async (req, res, next) => {
    try {

        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if (user[0]) {
            userInfo = user[0];
        }

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if (policies.length > 6) {
            policies = policies.slice(0, 6);
        }
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);


        var queryCategory = 'SELECT * FROM categories';
        const categories = await service.getAllCategoryProduct(queryCategory);

        let queryProject = 'SELECT * FROM project';
        let projects = await service.getAllProject(queryProject);


        await pool.query('SELECT * FROM policies', function (error, rows, fields) {
            if (error) throw error;
            res.render('datvangphanthiet/policies/policies', {
                title: 'Chính sách',
                userInfo: userInfo,
                projects: projects,
                policies: policies,
                blog_categories: blog_categories,
                categories: categories,
                policess: rows,
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

        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if (user[0]) {
            userInfo = user[0];
        }

        var query = `SELECT * FROM policies WHERE id = ?`;

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if (policies.length > 6) {
            policies = policies.slice(0, 6);
        }
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);


        var queryCategory = 'SELECT * FROM categories';
        const categories = await service.getAllCategoryProduct(queryCategory);

        let queryProject = 'SELECT * FROM project';
        let projects = await service.getAllProject(queryProject);

        // Lấy tất cả sản phẩm và hiển thị ra table
        await pool.query(query, policy_id, function (error, rows, fields) {
            if (error) throw error;
            res.render('datvangphanthiet/policies/policy', {
                title: 'Chi tiết chính sách',
                policy: rows[0],
                projects: projects,
                policies: policies,
                categories: categories,
                blog_categories: blog_categories,
                userInfo:userInfo,
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