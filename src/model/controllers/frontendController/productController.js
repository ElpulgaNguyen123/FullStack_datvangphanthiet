var pool = require('../../config/connectDb');
const service = require('../../../services');
const locationService = require('../../../services/locationService');

let FrProductController = async (req, res, next) => {
    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if(user[0]){
            userInfo = user[0];
        }
        const queryProduct = 'Select * from product';
        const querycategories = 'SELECT * FROM categories';
        const categories = await service.getAllCategoryProduct(querycategories);
        const products = await service.getAllProductFr(queryProduct);
        const query = 'Select * from product';

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }

        //categories
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);


        // locations
        let queryLocation ='SELECT * FROM locations';
        let locations = await service.getAllLocations(queryLocation);

        //newest real easte
        let querynewestPro ='SELECT * FROM product ORDER BY ID DESC LIMIT 4';
        let newproducts = await service.getAllProductFr(querynewestPro);


        // Lấy tất cả sản phẩm và hiển thị ra table
        res.render('datvangphanthiet/products/products', {
            title: 'Sản phẩm',
            userInfo : userInfo,
            products: products.slice(0,9),
            locations: locations,
            query : query,
            policies : policies,
            blog_categories : blog_categories,
            categories: categories,
            newproducts : newproducts,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
let getAllProductCategory = async (req, res, next) => {
    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if(user[0]){
            userInfo = user[0];
        }
        // Lấy tất cả sản phẩm và hiển thị ra table
        const querycategories = 'SELECT * FROM categories';
        const queryProduct = `SELECT * FROM product WHERE category_id = ?`;
        const categories = await service.getAllCategoryProduct(querycategories);
        const query = `SELECT * FROM product WHERE category_id = ${req.params.iddanhmuc}`;

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }
        // categories
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);


        // locations
        let queryLocation ='SELECT * FROM locations';
        let locations = await service.getAllLocations(queryLocation);

        //newest real easte
        let querynewestPro ='SELECT * FROM product ORDER BY ID DESC LIMIT 4';
        let newproducts = await service.getAllProductFr(querynewestPro);

        pool.query(queryProduct, req.params.iddanhmuc, async function (error, results, fields) {
            if (error) throw error;
            var title = '';
            const queryTittle = `SELECT * FROM categories WHERE id = ?`;
            const categoriesTitle = await service.queryActionCategoriesParams(queryTittle, req.params.iddanhmuc);
            if (categoriesTitle.length > 0) {
                title = categoriesTitle[0].category_name;
            }
            res.render('datvangphanthiet/products/products', {
                title: title,
                userInfo : userInfo,
                query : query,
                products: results,
                policies : policies,
                categories : categories,
                blog_categories : blog_categories,
                locations : locations,
                newproducts :newproducts,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

let getAllProductLocation = async (req, res, next) => {
    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if(user[0]){
            userInfo = user[0];
        }
        // Lấy tất cả sản phẩm và hiển thị ra table
        const querycategories = 'SELECT * FROM categories';
        const queryproduct = `SELECT * FROM product WHERE location_id = ?`;
        const categories = await service.getAllCategoryProduct(querycategories);
        const query = `SELECT * FROM product WHERE location_id = ${req.params.idlocation}`;

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }
        //categories
        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);
        // locations
        let queryLocation ='SELECT * FROM locations';
        let locations = await service.getAllLocations(queryLocation);

        //newest real easte
        let querynewestPro ='SELECT * FROM product ORDER BY ID DESC LIMIT 4';
        let newproducts = await service.getAllProductFr(querynewestPro);

        pool.query(queryproduct, req.params.idlocation, async function (error, results, fields) {
            if (error) throw error;
            var title = '';
            const queryTittle = `SELECT * FROM locations WHERE id = ?`;
            const locationTitle = await service.queryActionLocationsParams(queryTittle, req.params.idlocation);
            if (locationTitle.length > 0) {
                title = locationTitle[0].location_name;
            }
            res.render('datvangphanthiet/products/products', {
                title: title,
                userInfo : userInfo,
                query:query,
                products: results,
                policies: policies,
                blog_categories : blog_categories,
                categories: categories,
                locations : locations,
                newproducts : newproducts,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
                user: req.user
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
let FrProductDetailController = async (req, res, next) => {
    try {

        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if(user[0]){
            userInfo = user[0];
        }
        const getAllProductFrs = 'SELECT * from product WHERE id = ?';
        const queryFeature = `SELECT * FROM blog ORDER BY id DESC LIMIT 10`;
        const queryproductRelate = `SELECT * FROM product WHERE category_id = ? ORDER BY id DESC LIMIT 8        `
        const blogFeature = await service.getAllBlog(queryFeature);
        let product = await service.getAllProductFr(getAllProductFrs, req.params.id);
        let relateProducts = [];
        if (product[0].category_id) {
            relateProducts = await service.getAllProductFr(queryproductRelate, product[0].category_id);
        }else {
            relateProducts = [];
        }
        var images = '';
        var imagesArr = [];
        if (product[0]) {
            images = JSON.parse(product[0].image);
            imagesArr = Object.keys(images);
        }


        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);

        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);

        if (policies.length > 6) {
            policies = policiess.slice(0, 6);
        }

        var queryCategory = 'SELECT * FROM categories';        
        const categories = await service.getAllCategoryProduct(queryCategory);

        //Lấy tất cả sản phẩm và hiển thị ra table
        res.render('datvangphanthiet/products/product-detail', {
            title: '',
            product: product[0],
            userInfo : userInfo,
            policies : policies,
            blog_categories : blog_categories,
            categories : categories,
            blogFeature: blogFeature,
            images: images,
            relateProducts: relateProducts,
            imagearr: imagesArr,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        });

    } catch (error) {
        throw error;
        return res.status(500).send(error);
    }
}

let searchData = async (req, res, next) => {
    let successArr = [];
    try {
        var product_name = req.params.name;
        var queryProduct = `
        SELECT * FROM product WHERE name LIKE 
        '%${product_name}%' 
        ORDER BY ID DESC LIMIT 6`;
        var result = {};
        await pool.query(queryProduct, function (error, results, fields) {
            if (error) throw error;
            result.results = results;
            return res.status(200).send(result);
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send('Lôi');
    }
}

let getAllBikeDesc = async (req, res, next) => {
    try {

        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if(user[0]){
            userInfo = user[0];
        }
        // Lấy tất cả sản phẩm và hiển thị ra table
        const queryBrands = 'SELECT * FROM brand';
        const queryCategories = 'SELECT * FROM categories';
        const brands = await service.getAllBrand(queryBrands);
        const categories = await service.getAllCategoryProduct(queryCategories);
        const query = `SELECT * FROM product ORDER BY id DESC`;
        pool.query(`SELECT * FROM product ORDER BY id DESC`, function (error, results, fields) {
            if (error) throw error;
            var page = parseInt(req.query.page) || 1; // n
            var perPage = 10; // x
            var start = (page - 1) * perPage;
            var end = page * perPage;
            var totalPage = Math.ceil(results.length / 10);
            var pageDistance = page + 3;
            res.render('admin/products/products', {
                title: 'Sản phẩm',
                userInfo : userInfo,
                query : query,
                products: results.slice(start, end),
                pages: pageDistance,
                page: page,
                brands: brands,
                categories: categories,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
                user: req.user
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

let getPageLoad = async (req, res, next) => {
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
    FrProductController,
    FrProductDetailController,
    getAllProductCategory,
    getAllProductLocation,
    searchData,
    getAllBikeDesc,
    getPageLoad
};