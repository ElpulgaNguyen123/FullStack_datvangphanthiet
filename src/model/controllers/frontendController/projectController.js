var pool = require('../../config/connectDb');
const { query } = require('express');
const service = require('../../../services');

let FrProjectController = async (req, res, next) => {
    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if(user[0]){
            userInfo = user[0];
        }

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);


        var queryCategory = 'SELECT * FROM categories';        
        const categories = await service.getAllCategoryProduct(queryCategory);
        

        // Lấy tất cả sản phẩm và hiển thị ra table
        pool.query('SELECT * FROM user', function (error, results, fields) {
            if (error) throw error;
            res.render('datvangphanthiet/projects/project', {
                title: 'Dự án',
                policies : policies,
                categories : categories,
                blog_categories : blog_categories,
                userInfo : userInfo,
                errors: req.flash('Errors'),
                success: req.flash('Success')
            })
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
module.exports = FrProjectController;