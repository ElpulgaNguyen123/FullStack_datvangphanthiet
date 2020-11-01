var pool = require('../../config/connectDb');
var service = require('../../../services');

let notFoundController = async (req, res, next) => {
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

        await pool.query('SELECT * FROM endow', function (error, rows, fields) {
            if (error) throw error;
            res.render('datvangphanthiet/notfound/notfound', {
                title: 'Trang Không tìm thấy',
                projects: projects,
                policies: policies,
                categories: categories,
                blog_categories: blog_categories,
                userInfo: userInfo,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}



let successController = async (req, res, next) => {
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

        res.render('datvangphanthiet/successpage/successpage', {
            title: 'thành công',
            projects: projects,
            policies: policies,
            categories: categories,
            blog_categories: blog_categories,
            userInfo: userInfo,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


let errorController = async (req, res, next) => {
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

        res.render('datvangphanthiet/successpage/errorpage', {
            title: 'Lỗi',
            projects: projects,
            policies: policies,
            categories: categories,
            blog_categories: blog_categories,
            userInfo: userInfo,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    notFoundController,
    successController,
    errorController
};
