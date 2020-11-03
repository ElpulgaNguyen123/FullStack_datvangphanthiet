var pool = require('../../config/connectDb');
const { query } = require('express');
const service = require('../../../services');

let FrhomeController = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        let products = [];
        var slideQuery = 'SELECT * FROM slide';
        var brandQuery = 'SELECT * FROM brand';
        var queryCategory = 'SELECT * FROM categories';
        var queryCompanyFeatures = 'SELECT * FROM feature_company';
        let queryPolicies = 'SELECT * FROM policies';
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        var queryBlog = 'Select * from blog';
        let queryStaff = 'SELECT * FROM staffs';
        var queyProduct =`SELECT * FROM product ORDER BY ID DESC LIMIT 6`;
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);

        if(user[0]){
            userInfo = user[0];
        }
        const categories = await service.getAllCategoryProduct(queryCategory);

        const slide = await service.getAllSlide(slideQuery);
        const brand = await service.getAllBrand(brandQuery);
        const company_features = await service.getAllEndow(queryCompanyFeatures);
        const blogs = await service.getAllBlog(queryBlog);
        const staffs = await service.getAllStaffService(queryStaff);


        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);
        let policies = await service.getAllPolicies(queryPolicies);
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }

        let queryProject = 'SELECT * FROM project';
        let projects = await service.getAllProject(queryProject);

        // locations
        let queryLocation ='SELECT * FROM locations';
        let locations = await service.getAllLocations(queryLocation);

        var queryCustomer = 'SELECT * FROM customers';
        const customers = await service.getAllCustomer(queryCustomer);

        //query new blog 
        let queryNewBlog =`
        SELECT blog.id,
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
        ON blog.blog_category_id = blog_categories.id
        ORDER BY blog.id DESC LIMIT 3`;
        
        let newBlogs = await service.getAllBlog(queryNewBlog);

        products = await service.queryActionNoParams(queyProduct);
        pool.query('SELECT * FROM user', function (error, results, fields) {
            if (error) throw error;
            res.render('datvangphanthiet/home/home', {
                title: 'Trang chủ',
                slides: slide,
                products : products,
                newBlogs:newBlogs.slice(0,3),
                locations:locations,
                customers:customers,
                projects : projects,
                policies : policies,
                categories : categories,
                blog_categories : blog_categories,
                company_features : company_features,
                brands: brand.slice(0, 8),
                staffs : staffs.slice(0,4),
                blogs: blogs,
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
module.exports = FrhomeController;