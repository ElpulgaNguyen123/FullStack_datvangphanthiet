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

let FrProjectDetailController = async (req, res, next) => {

    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if(user[0]){
            userInfo = user[0];
        }
        const getAllProjectFrs = 'SELECT * from project WHERE id = ?';
        let project = await service.getAllProductFr(getAllProjectFrs, req.params.id);

        var images = '';
        var imagesArr = [];
        if (project[0]) {
            images = JSON.parse(project[0].project_image);
            imagesArr = Object.keys(images);
        }

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);

        if (policies.length > 6) {
            policies = policies.slice(0, 6);
        }

        var queryCategory = 'SELECT * FROM categories';        
        const categories = await service.getAllCategoryProduct(queryCategory);

        let queryProject = 'SELECT * FROM project';
        let projects = await service.getAllProject(queryProject);


        var queryCompanyFeatures = 'SELECT * FROM feature_company';
        const company_features = await service.getAllEndow(queryCompanyFeatures);


        //Lấy tất cả sản phẩm và hiển thị ra table
        res.render('datvangphanthiet/projects/project-details', {
            title: project[0].project_name,
            project: project[0],
            userInfo : userInfo,
            projects:projects,
            policies : policies,
            blog_categories : blog_categories,
            categories : categories,
            company_features : company_features,
            images: images,
            imagearr: imagesArr,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        });

    } catch (error) {
        return res.status(500).send(error);
    }
}



module.exports = {
    FrProjectController,
    FrProjectDetailController
};