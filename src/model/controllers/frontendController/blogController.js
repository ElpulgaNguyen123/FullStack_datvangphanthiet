var pool = require('../../config/connectDb');
const { query } = require('express');
const service = require('../../../services');
const { response } = require('../../../../app');

let FrBlogController = async (req, res, next) => {
    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if (user[0]) {
            userInfo = user[0];
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

        const queryBlog = 'Select * from blog inner join blog_categories ON blog.blog_category_id = blog_categories.id';
        const blogs = await service.getAllBlog(queryBlog);

        let queryProject = 'SELECT * FROM project';
        let projects = await service.getAllProject(queryProject);

        // Lấy tất cả sản phẩm và hiển thị ra table
        res.render('datvangphanthiet/blogs/blogs', {
            title: 'Blog',
            query : queryBlog,
            projects: projects,
            policies: policies,
            blog_categories: blog_categories,
            categories: categories,
            userInfo: userInfo,
            blogs: blogs,
            newblogs: blogs.slice(0, 3),
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
let FrBlogCategoryController = async (req, res, next) => {
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

        var queryCategory = 'SELECT * FROM categories';
        const categories = await service.getAllCategoryProduct(queryCategory);

        let queryProject = 'SELECT * FROM project';
        let projects = await service.getAllProject(queryProject);


        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);
        const queryBlog = `SELECT blog.id,
        blog.title, 
        blog.slug,
        blog.image,
        blog.create_at,
        blog.author,
        blog_categories.id as category_id,
        blog_categories.blog_category_name,
        blog_categories.blog_category_slug
        FROM blog 
        INNER JOIN blog_categories 
        ON blog.blog_category_id = blog_categories.id where blog.blog_category_id = ?`;
        const blogs = await service.getBlog(queryBlog, req.params.id);
        // Lấy tất cả sản phẩm và hiển thị ra table
        res.render('datvangphanthiet/blogs/blogs', {
            title: 'Blog',
            query : queryBlog,
            policies: policies,
            projects: projects,
            blog_categories: blog_categories,
            categories: categories,
            userInfo: userInfo,
            blogs: blogs,
            newblogs: blogs.slice(0, 3),
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
let FrBlogDetailController = async (req, res, next) => {
    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if (user[0]) {
            userInfo = user[0];
        }
        const queryBlog = 'Select * from blog inner join blog_categories ON blog.blog_category_id = blog_categories.id';
        const queryBlogDetail = 'SELECT * from blog WHERE id = ?';
        const queryFeature = `SELECT * FROM blog ORDER BY id DESC LIMIT 4`;
        const blogFeature = await service.getAllBlog(queryFeature);
        const blog = await service.getBlog(queryBlogDetail, req.params.id);

        var queryRelateBlog = '';

        if (blog[0].blog_category_id == '') {
            queryRelateBlog = `SELECT * FROM blog WHERE blog_category_id = 1 ORDER BY id DESC LIMIT 8`
        }else{
            queryRelateBlog = `SELECT * FROM blog WHERE blog_category_id = ${blog[0].blog_category_id} ORDER BY id DESC LIMIT 8`
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
        const blogs = await service.getAllBlog(queryBlog);
        const relateBlogs = await service.getAllBlog(queryRelateBlog);

        let queryProject = 'SELECT * FROM project';
        let projects = await service.getAllProject(queryProject);

        if (blog[0]) {
            //Lấy tất cả sản phẩm và hiển thị ra table
            res.render('datvangphanthiet/blogs/blog-detail', {
                title: 'Blog',
                blog: blog[0],
                projects: projects,
                policies: policies,
                categories: categories,
                blog_categories: blog_categories,
                categories: categories,
                newblogs: blogs.slice(0, 3),
                blogFeature: blogFeature,
                relateBlogs:relateBlogs,
                userInfo: userInfo,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });

        } else {
            res.send('Lỗi không tìm thấy');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
let searchBlogData = async (req, res, next) => {
    let successArr = [];
    try {
        var blog_name = req.params.name;
        var queryBlog = `
        SELECT * FROM blog WHERE title LIKE 
        '%${blog_name}%' 
        ORDER BY ID DESC LIMIT 6`;
        var result = {};
        await pool.query(queryBlog, function (error, results, fields) {
            if (error) throw error;
            result.results = results;
            return res.status(200).send(result);
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send('Lôi');
    }
}
let getPageLoadBlog = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var query = req.body.query;
        pool.query(query, function (error, results, fields) {
            if (error) throw error;
            let count = 0;
            for (var i = 0; i < results.length; i++) {
                count++;
            }
            let page = parseInt(req.params.page) || 1;
            // số sản phẩm trên 1 trang.
            let perPage = 10;
            let start = (page - 1) * perPage;
            let end = page * perPage;
            let result = {};

            result.products = results.slice(start, end);
            results.count = req.params.page;
            result.page = req.params.page;

            return res.status(200).send(result);

        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
module.exports = {
    FrBlogController,
    FrBlogDetailController,
    FrBlogCategoryController,
    searchBlogData,
    getPageLoadBlog
};