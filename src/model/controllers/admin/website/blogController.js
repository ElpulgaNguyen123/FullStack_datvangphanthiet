var pool = require('../../../config/connectDb');
var app = require('../../../config/app');
var service = require('../../../../services');
var multer = require('multer');
var { uuid } = require('uuidv4');
var { Transuccess, Tranerrors } = require('../../../../../lang/vi');
var sharp = require('sharp');
var fs = require('fs');
var fsExtras = require('fs-extra');

// initial storage. // start
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, app.directory_products);
        cb(null, app.directory_blogs);
    },
    filename: function (req, file, cb) {
        // let match = app.avatar_type;
        let match = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
        if (match.indexOf(file.mimetype) === -1) {
            return cb(error, null);
        }
        cb(null, file.originalname);
    }
});
var productUploadFile = multer({ storage: storage }).single('blog_image');
// initial storage. // end

// get all Blog // start
let getAllBlog = async (req, res, next) => {
    try {
        await pool.query('SELECT * FROM blog', function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/blog/blog', {
                title: 'Blog',
                blogs: rows,
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
// get all Blog // end

// add more Blog // start
let addBlogGet = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var queryBlogCategories = 'SELECT * FROM blog_categories';
        var blogCategories = await service.getAllBlogCategories(queryBlogCategories);

        var user = req.user || {};
        res.render('admin/website/blog/add-blog', {
            title: 'Thêm tin tức',
            blog_categories: blogCategories,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
// add more Blog // end

// add image Blog // start
let addBlogPost = (req, res, next) => {
    productUploadFile(req, res, (error) => {
        try {
            var arrayError = [],
                successArr = [];
            var generatecode = uuid();
            if (req.file) {
                // resize image before uploads.
                sharp(`${req.file.destination}/${req.file.filename}`)
                    .resize(900, 550)
                    .toFile(`${req.file.destination}/${req.file.filename}-${generatecode}.webp`, (err, info) => {
                        fs.unlinkSync(req.file.path);
                    });
            }
            var filename = '';
            if (req.file) {
                filename = `${req.file.filename}-${generatecode}.webp`;
            }
            let current_datetime = new Date()
            let formatted_date = current_datetime.
            getDate() + "-" + (current_datetime.
                getMonth() + 1) + "-" + current_datetime.
                getFullYear();
            var queryNew = `INSERT INTO blog (title,slug,
                blog_category_id, 
                content, 
                short_description, image, 
                author, create_at) VALUES ?`;
            var blogValues = [
                [req.body.blog_title,
                req.body.blog_slug,
                req.body.blog_category,
                req.body.blog_content,
                req.body.short_description,
                    filename,
                req.body.blog_author,
                    formatted_date]
            ];

            pool.query(queryNew, [blogValues], function (error, results, fields) {
                if (error) {
                    fsExtras.remove(`${app.directory_blogs}/${filename}`);
                    arrayError.push(Tranerrors.createError('tin tức'));
                    req.flash('Errors', arrayError);
                    res.redirect('/admin/blog');
                }
                successArr.push(Transuccess.createSuccess('Tin tức'));
                req.flash('Success', successArr);
                res.redirect('/admin/blog');
            });
        } catch (error) {
            arrayError.push(Tranerrors.createError('tin tức'));
            req.flash('Errors', arrayError);
            res.redirect('/admin/blog');
        }
    })
}
// add more Blog // end

// edit Blog get method // start
let getEditBlog = async (req, res, next) => {
    try {
        var blog_id = req.params.id;
        var arrayError = [],
            successArr = [];

        var queryBlogCategories = 'SELECT * FROM blog_categories';
        var blogCategories = await service.getAllBlogCategories(queryBlogCategories);

        var query = `SELECT * FROM blog WHERE id = ?`;
        // Lấy tất cả sản phẩm và hiển thị ra table
        await pool.query(query, blog_id, function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/blog/edit-blog', {
                title: 'Chỉnh sừa tin tức',
                blog: rows[0],
                blog_categories: blogCategories,
                user: req.user,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
// edit Blog get method // end
// edit blog post method // start
let postEditBlog = (req, res, next) => {
    productUploadFile(req, res, async (error) => {
        try {
            // Lấy tất cả sản phẩm và hiển thị ra table
            var arrayError = [],
                successArr = [];
            var generatecode = uuid();
            if (req.file) {
                // resize image before uploads.
                sharp(`${req.file.destination}/${req.file.filename}`)
                    .resize(900, 550)
                    .toFile(`${req.file.destination}/${req.file.filename}-${generatecode}.webp`, async (err, info) => {
                        fs.unlinkSync(req.file.path);
                        if (req.body.blog_old_image) {
                            await fsExtras.remove(`${app.directory_blogs}/${req.body.blog_old_image}`);
                        }
                    });
            }
            var filename = '';
            if (req.file) {
                filename = `${req.file.filename}-${generatecode}.webp`;
            }
            else if (req.body.blog_old_image) {
                filename = `${req.body.blog_old_image}`;
            }

            let current_datetime = new Date()
            let formatted_date_update = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate();
            var queryUpdate = `
            UPDATE blog
            SET title = ?, 
            slug = ?,
            blog_category_id = ?, 
            content = ?,
            short_description = ?,
            image = ?,
            author = ?,
            update_at = ?
            WHERE id = ?`
            var blogValues = [
                req.body.blog_title,
                req.body.blog_slug,
                req.body.blog_category,
                req.body.blog_content,
                req.body.short_description,
                filename,
                req.body.blog_author,
                formatted_date_update,
                req.params.id
            ]
            await pool.query(queryUpdate, blogValues, function (error, results, fields) {
                if (error){
                    arrayError.push(Tranerrors.saveError('tin tức'));
                    req.flash('Errors', arrayError);
                    res.redirect('/admin/blog/edit-blog/' + req.params.id);
                };
                successArr.push(Transuccess.saveSuccess('tin tức'));
                req.flash('Success', successArr);
                res.redirect('/admin/blog/edit-blog/' + req.params.id);
            });
        } catch (error) {
            arrayError.push(Tranerrors.saveError('tin tức'));
            req.flash('Errors', arrayError);
            res.redirect('/admin/blog/edit-blog/' + req.params.id);
        }
    })
}
// edit blog post method // end
// delete blog // start
let postDeleteBlog = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var arrayError = [],
            successArr = [];

        var blog_id = req.params.id;
        var query = `SELECT * FROM blog WHERE id = ?`;
        // Lấy tất cả sản phẩm và hiển thị ra table
        var Image_delete = await service.queryActionBlogelete(query, blog_id);
        var querydeleteblog = `
        DELETE FROM 
        blog
        WHERE id = ${blog_id}`;
        pool.query(querydeleteblog, async function (error, results, fields) {
            if (error) throw error;
            if (Image_delete != null || Image_delete != '') {
                await fsExtras.remove(`${app.directory_blogs}/${Image_delete}`);
            }
            successArr.push(Transuccess.deleteSuccess('Blog'));
            req.flash('Success', successArr);
            res.redirect('/admin/blog');
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
// delete blog // end
// all category blog
let getAllBlogCategory = async (req, res, next) => {
    try {
        await pool.query('SELECT * FROM blog_categories', function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/blog/categories/categories', {
                title: 'Danh mục tin tức',
                blog_categories: rows,
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
// dẫn đến trang thêm blog categories
let addBlogCategoryGet = (req, res, next) => {
    // Lấy tất cả sản phẩm và hiển thị ra table
    var user = req.user || {};
    res.render('admin/website/blog/categories/add-category', {
        title: 'Thêm Danh mục tin',
        errors: req.flash('Errors'),
        success: req.flash('Success'),
        user: user
    });
}
let addBlogCategoryPost = (req, res, next) => {
    try {
        var arrayError = [],
            successArr = [];
        let queryNew = `INSERT INTO blog_categories (blog_category_name, blog_category_slug) VALUES ?`;
        var blogCategoriesValues = [
            [req.body.blog_category_name,
            req.body.blog_category_slug]
        ];
        pool.query(queryNew, [blogCategoriesValues], function (error, results, fields) {
            if (error) {
                arrayError.push(Tranerrors.createError('danh mục'));
                req.flash('Error', successArr);
                res.redirect('/admin/blog-category/add-blog-category');
            };
            successArr.push(Transuccess.createSuccess('danh mục'));
            req.flash('Success', successArr);
            res.redirect('/admin/blog-category/add-blog-category');
        });
    } catch (error) {
        arrayError.push(Tranerrors.createError('danh mục'));
        req.flash('Error', successArr);
        res.redirect('/admin/blog-category/add-blog-category');
    }
}
let editBlogCategoryGet = async (req, res, next) => {
    try {
        var blog_category_id = req.params.id;
        var arrayError = [],
            successArr = [];
        let query = `SELECT * FROM blog_categories WHERE id = ?`;
        // Lấy tất cả sản phẩm và hiển thị ra table
        await pool.query(query, blog_category_id, function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/blog/categories/edit-category', {
                title: 'Chỉnh sửa danh mục',
                blog_category: rows[0],
                user: req.user,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
// lấy thông tin chỉnh sửa gửi lên update lên server
let editBlogCategoryPost = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var arrayError = [],
            successArr = [];
        let queryUpdate = `
        UPDATE blog_categories
        SET blog_category_name = ?, 
        blog_category_slug = ?
        WHERE id = ?`
        var blogcategoriesValues = [
            req.body.blog_category_name,
            req.body.blog_category_slug,
            req.params.id
        ]
        await pool.query(queryUpdate, blogcategoriesValues, function (error, results, fields) {
            if (error) {
                arrayError.push(Tranerrors.saveError('danh mục'));
                req.flash('Error', successArr);
                res.redirect('/admin/blog-category/edit-blog-category/' + req.params.id);
            };
            successArr.push(Transuccess.saveSuccess('danh mục'));
            req.flash('Success', successArr);
            res.redirect('/admin/blog-category/edit-blog-category/' + req.params.id);
        });
    } catch (error) {
        arrayError.push(Tranerrors.saveError('danh mục'));
        req.flash('Error', successArr);
        res.redirect('/admin/blog-category/edit-blog-category/' + req.params.id);
    }
}

// delete blog // start
let postDeleteBlogCategory = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var arrayError = [],
            successArr = [];

        var blog_category_id = req.params.id;
        var querydeleteblogCategory = `
        DELETE FROM 
        blog_categories
        WHERE id = ${blog_category_id}`;
        pool.query(querydeleteblogCategory, function (error, results, fields) {
            if (error) {
                arrayError.push(Tranerrors.deleteError('danh mục'));
                req.flash('Error', successArr);
                res.redirect('/admin/blog-categories');
            }
            successArr.push(Transuccess.deleteSuccess('danh mục'));
            req.flash('Success', successArr);
            res.redirect('/admin/blog-categories');
        });
    } catch (error) {
        arrayError.push(Tranerrors.deleteError('danh mục'));
        req.flash('Error', successArr);
        res.redirect('/admin/blog-categories');
    }
}
// delete blog // end

module.exports = {
    getAllBlog,
    addBlogGet,
    addBlogPost,
    getEditBlog,
    postEditBlog,
    postDeleteBlog,

    getAllBlogCategory,
    addBlogCategoryGet,
    addBlogCategoryPost,
    editBlogCategoryGet,
    editBlogCategoryPost,
    postDeleteBlogCategory
};