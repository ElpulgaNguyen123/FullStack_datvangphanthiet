var pool = require('../../config/connectDb');
var app = require('../../config/app');
var multer = require('multer');
var { uuid } = require('uuid4');
var service = require('../../../services');
var { Transuccess } = require('../../../../lang/vi');
var sharp = require('sharp');
var fs = require('fs');
var fsExtras = require('fs-extra');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, app.directory_products);
        cb(null, app.directory_products);
    },
    filename: function (req, file, cb) {
        // let match = app.avatar_type;
        let match = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'];
        if (match.indexOf(file.mimetype) === -1) {
            return cb(error, null);
        }
        //let fileName = `${file.fieldname}-${uuidv4()}-${Date.now()}-${file.originalname}`;
        cb(null, file.originalname);
    }
});

var productUploadFile = multer({ storage: storage }).any('project-images', 4);
var productUpdateFile = multer({ storage: storage }).single('project-image', 1);
// Lấy danh sách sản phẩm.
let getAllProject = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        const queryProject = `SELECT * FROM projects`;
        pool.query(queryProject, function (error, results, fields) {
            if (error) throw error;
            res.render('admin/project/project', {
                title: 'Dự án',
                projects: results.slice(0, 10),
                errors: req.flash('Errors'),
                success: req.flash('Success'),
                user: req.user
            });
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}

// chuyển qua trang thêm sản phẩm   
let addProjectGet = async (req, res, next) => {
    try {
        var queryattributes = 'SELECT * FROM attributes';
        var querycategories = 'SELECT * FROM categories';
        var attributes = await service.queryActionNoParams(queryattributes);
        var categories = await service.queryActionNoParams(querycategories);
        pool.query('SELECT * FROM brand', function (error, results, fields) {
            res.render('admin/products/addproduct', {
                title: 'Thêm sản phẩm',
                brands: results,
                attributes: attributes,
                categories: categories,
                user: req.user
            });
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}

module.exports = {
    getAllProject,
    addProjectGet
};