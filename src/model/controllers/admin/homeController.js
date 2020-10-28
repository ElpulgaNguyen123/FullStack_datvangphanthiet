var pool = require('../../config/connectDb');
var service = require('../../../services');

let homeController = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var user = req.user || {};
        var queyProduct = 'SELECT * FROM product ORDER BY ID DESC LIMIT 6';
        var queryBlog = 'SELECT * FROM blog';
        var querySlide = 'SELECT * FROM slide';
        const queryProject = `SELECT * FROM project`;
        let projects = await service.getAllProject(queryProject);
        var products = [];
        var blogs = [];
        var productCount = 0;
        var blogCount = 0;
        var slideCount = 0;
        var projectCount = 0;
        const allProducts = await service.queryActionNoParams(queyProduct);
        const allBlogs = await service.getAllBlog(queryBlog);
        const allSLide = await service.getAllSlide(querySlide);

        if(allProducts){
            products = allProducts.slice(0,6);
            blogs = allBlogs.slice(0,6);
        }
        for(var x = 0; x < allProducts.length; x++){
            productCount++;
        }
        for(var x = 0; x < allBlogs.length; x++){
            blogCount++;
        }
        for(var x = 0; x < allSLide.length; x++){
            slideCount++;
        }
        for(var x = 0; x < projects.length; x++){
            projectCount++;
        }

        res.render('admin/home/home', {
            title: 'Trang chủ',
            products : products,
            blogs : blogs,
            slideCount : slideCount,
            productCount : productCount,
            blogCount : blogCount,
            projectCount :projectCount,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
            user: user
        })
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin');
    }
}
module.exports = homeController;