var pool = require('../../config/connectDb');
const { query } = require('express');
const service = require('../../../services');

let FrAboutController = async (req, res, next) => {
    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var queryCompanyFeatures = 'SELECT * FROM feature_company';
        var queryCustomer = 'SELECT * FROM customers';
        let queryStaff = 'SELECT * FROM staffs';


        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);

        var queryCategory = 'SELECT * FROM categories';        
        const categories = await service.getAllCategoryProduct(queryCategory);




        const company_features = await service.getAllEndow(queryCompanyFeatures);
        const customers = await service.getAllCustomer(queryCustomer);
        const staffs = await service.getAllStaffService(queryStaff);

        var user = await service.getAllUser(queryUser);
        if(user[0]){
            userInfo = user[0];
        }
        // Lấy tất cả sản phẩm và hiển thị ra table
        res.render('datvangphanthiet/about/about', {
            title: 'Giới thiệu',
            userInfo : userInfo,
            staffs : staffs,
            policies : policies,
            categories : categories,
            blog_categories : blog_categories,
            customers : customers,
            company_features :  company_features,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
module.exports = FrAboutController;