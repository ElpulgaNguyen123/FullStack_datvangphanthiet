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
        cb(null, app.directory_projects);
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

var productUploadFile = multer({ storage: storage }).any('product-images', 4);
var productUpdateFile = multer({ storage: storage }).single('product-image', 1);
// Lấy danh sách sản phẩm.
let getAllProject = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        const queryProject = `SELECT * FROM project`;
        const query = `SELECT * FROM project`;

        pool.query(queryProject, function (error, results, fields) {
            if (error) throw error;
            res.render('admin/projects/projects', {
                title: 'Dự án',
                query: query,
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

// kiểm tra mã Sku
let checkSkuMatchProject = async (req, res, next) => {
    let sku = req.body.sku;
    let results = {};
    var queryCheckSkuMatch = `SELECT * FROM project WHERE project_sku = '${sku}'`;
    await service.checkSkuMatch(queryCheckSkuMatch)
        .then((value) => {
            results.success = value;
            res.status(200).send(results);
        }).catch(function (e) {
            res.status(500).send(e);
            return false;
        });
}

// chuyển qua trang thêm sản phẩm   
let addProjectGet = async (req, res, next) => {
    try {
        pool.query('SELECT * FROM project', function (error, results, fields) {
            res.render('admin/projects/addproject', {
                title: 'Thêm dự án',
                errors: req.flash('Errors'),
                success: req.flash('Success'),
                user: req.user
            });
        });
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/projects');
    }
}
// Thêm hình ảnh dự án
let addProjectImage = (req, res, next) => {
    productUploadFile(req, res, (error) => {
        let successArr = [];
        let arrayError = [];
        try {
            //thực hiện báo về cho protend;
            if (req.files) {
                req.files.map(async (file) => {
                    try {
                        await sharp(file.path).resize(800, 600).toBuffer(function (err, buffer) {
                            fs.writeFile(file.path, buffer, function (e) {
                            });
                        });
                    } catch (e) {
                        console.error(e);
                    }
                });
            }
        } catch (error) {
            console.log(error);
            req.flash('errors', arrayError);
            res.redirect('/admin/projects');
            return res.status(500).send(error);
        }
    })
}
// lấy hình ảnh được sửa update để gửi xuống cho client
let editProjectImage = async (req, res, next) => {
    try {
        var product_id = req.params.id;
        var image_index = req.query.index;
        var query = `SELECT project_image from project WHERE id = ${product_id}`
        var imageLink = await service.getImageProduct(query);
        var Obj = JSON.parse(imageLink[0].project_image);

        var result = {
            id: req.params.id,
            index: req.query.index,
            imageName: Obj[image_index],
        }
        return res.status(200).send(result);

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/projects/edit-project/' + req.params.id);
    }
    // Everything went fine
}
// thực hiện update hình ảnh đã được chọn lên server
let updateProjectImagePost = (req, res, next) => {
    productUpdateFile(req, res, async (error) => {
        var arrayError = [],
            successArr = [];
        try {
            if (req.file) {
                var product_id = req.params.id;
                var index = req.query.index;
                var dateUpdate = Date.now();
                await sharp(`${req.file.destination}/${req.file.filename}`)
                    .resize(800, 600)
                    .toFile(`${req.file.destination}/${dateUpdate}-${req.file.filename}`, (err, info) => {
                        fs.unlinkSync(req.file.path);
                    });
                var filename = '';
                if (req.file) {
                    filename = `${dateUpdate}-${req.file.filename}`;
                }
                var query = `SELECT project_image from project WHERE id = ${product_id}`
                var imageLink = await service.getImageProduct(query);
                // lấy da được object.
                var Obj = JSON.parse(imageLink[0].project_image);
                var old_image = Obj[index];
                Obj[index] = filename;
                Obj = JSON.stringify(Obj);
                await fsExtras.remove(`${app.directory_products}/${old_image}`);
                var ProductValues = [
                    Obj,
                    product_id
                ];
                var queryUpdateImage = `
                UPDATE project
                SET project_image = ? 
                WHERE id = ?`
                await pool.query(queryUpdateImage, ProductValues, function (error, results, fields) {
                    if (error) throw error;
                    let result = {
                        message: Transuccess.product_updated,
                        imageSrc: filename,
                        idImage: `image_${product_id}_${index}`
                    }
                    successArr.push('Cập nhật hình ảnh thành công !');
                    return res.status(200).send(result);
                });
            }

        } catch (error) {
            arrayError.push('Có lỗi xảy ra');
            req.flash('errors', arrayError);
            res.redirect('/admin/products');
        }
        // Everything went fine.
    });
}
// Thêm dự án
let addProjectPost = (req, res, next) => {
    let productItem = [];
    let successArr = [];
    let arrayError = [];
    productUploadFile(req, res, async (error) => {
        try {
            productItem[0] = req.body.product_sku;
            productItem[1] = req.body.product_name;
            productItem[2] = req.body.product_price;
            productItem[3] = `${req.body.image_path}` || '';
            productItem[4] = req.body.propduct_description;
            productItem[5] = req.body.product_slug;

            var queryNewProject = `
            INSERT INTO 
            project(
                project_sku, 
                project_name,
                project_price,
                project_image,
                project_description, 
                project_slug)
            VALUES (?,?,?,?,?,?)`;

            // tạo mới sản phẩm
            await service.newProduct(queryNewProject, productItem);
            // lấy được id sản phẩm vửa tạo.
            successArr.push(Transuccess.createSuccess('dự án'));
            req.flash('Success', successArr);
            return res.redirect('/admin/projects');

        } catch (error) {
            arrayError.push('Có lỗi xảy ra');
            req.flash('errors', arrayError);
            res.redirect('/admin/projects');
        }
    })
}
let searchDataProject = async (req, res, next) => {
    let successArr = [];
    try {
        var project_name = req.params.name;
        var queryBike = `
        SELECT * FROM project WHERE project_name LIKE 
        '%${project_name}%' 
        ORDER BY ID DESC LIMIT 6`;
        var result = {};
        await pool.query(queryBike, function (error, results, fields) {
            if (error) throw error;
            result.results = results;
            return res.status(200).send(result);
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/projects');
    }
}
// edit product info Get
let editProjectGet = async (req, res, next) => {
    var arrayError = [],
        successArr = [];
    try {
        let project_id = req.params.id;
        var query = `SELECT * FROM project where id= ${project_id}`;
        pool.query(query, function (error, rows, fields) {

            if (error) throw error;
            var images = '';
            var count = '';
            var imagesArr = [];
            if (rows[0].project_image != '') {
                images = JSON.parse(rows[0].project_image);
                imagesArr = Object.keys(images);
            }
            res.render('admin/projects/editproject', {
                title: 'Chỉnh Sửa dự án',
                project: rows[0],
                images: images,
                imagearr: imagesArr,
                user: req.user,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/projects');
    }
}
// edit product post
let editProjectPost = (req, res, next) => {
    let productItem = [];
    let successArr = [];
    let arrayError = [];
    productUploadFile(req, res, async (error) => {
        try {
            var queryUpdate = `UPDATE project
            SET  
            project_sku = ?, 
                project_name = ?,
                project_price = ?,
                project_description = ?, 
                project_slug = ?,
                project_image = ?
            WHERE id = ?`;

            productItem[0] = req.body.product_sku;
            productItem[1] = req.body.product_name;
            productItem[2] = req.body.product_price;
            productItem[3] = req.body.propduct_description;
            productItem[4] = req.body.product_slug;

            var query = `SELECT project_image from project WHERE id = ${req.params.id}`
            var imageLink = await service.getImageProduct(query);
            // kiểm tra hình ảnh up lên vào cập nhật vàn danh sách
            if (imageLink[0].project_image == '' && req.body.image_path != '') {
                productItem[5] = req.body.image_path;
            }
            else if (imageLink[0].project_image != '' && req.body.image_path != '') {
                var Obj = JSON.parse(imageLink[0].project_image);
                var Obj2 = JSON.parse(req.body.image_path);
                var count = Object.keys(Obj).length;
                var array = [];
                for (var x in Obj2) {
                    Obj[`${count}`] = Obj2[x];
                    array.push(Obj2[x]);
                }
                for (var index = 0; index <= array.length - 1; index++) {
                    Obj[`${count}`] = array[index];
                    count++;
                }
                productItem[5] = JSON.stringify(Obj);
            } else {
                productItem[5] = imageLink[0].project_image;
            }
            productItem[6] = req.params.id;

            await pool.query(queryUpdate, productItem, function (error, results, fields) {
                if (error) throw error;
                successArr.push(Transuccess.createSuccess(' Chỉnh sửa dự án thành công '));
                req.flash('Success', successArr);
                return res.redirect('/admin/project/edit-project/' + req.params.id);
            });

        } catch (error) {
            arrayError.push('Có lỗi xảy ra');
            req.flash('errors', arrayError);
            res.redirect('/admin/project/edit-project/' + req.params.id);
        }
    })
}

// Xóa cụ thể hình ảnh sản phẩm
let deleteProjectImage = async (req, res, next) => {
    let successArr = [];
    try {
        var product_id = req.params.id;
        var index = req.query.index;
        var query = `SELECT project_image from project WHERE id = ${product_id}`
        var imageLink = await service.getImageProduct(query);

        var Obj = JSON.parse(imageLink[0].project_image);
        var old_image = Obj[index];
        delete Obj[index];
        await fsExtras.remove(`${app.directory_products}/${old_image}`);
        Obj = JSON.stringify(Obj);
        var ProductValues = [
            Obj,
            product_id
        ];
        var queryUpdateImage = `
        UPDATE project
        SET project_image = '${Obj}' 
        WHERE id = ${product_id}`;
        await pool.query(queryUpdateImage, ProductValues, function (error, results, fields) {
            if (error) throw error;
            successArr.push(Transuccess.deleteSuccess('Xóa hình ảnh thành công !'));
            req.flash('Success', successArr);
            return res.redirect('/admin/project/edit-project/' + product_id);
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/project/edit-project/' + product_id);
    }
}

// Xóa dự án
let deleteProjectController = async (req, res, next) => {
    let successArr = [];
    try {
        var iddelete = req.params.iddelete;
       
        const querydeleteProject = `DELETE FROM project where id = ${iddelete}`;
        const queryImage = `SELECT project_image FROM project WHERE id = ${iddelete}`;
        const images = await service.queryActionNoParams(queryImage);

        let imagesParse = '';
        let imagesArr = [];
        if (images[0].project_image != '') {
            imagesParse = JSON.parse(images[0].project_image);
            imagesArr = Object.keys(imagesParse);
            for (var i = 0; i < imagesArr.length; i++) {
                await fsExtras.remove(`${app.directory_projects}/${imagesParse[imagesArr[i]]}`);
            }
        }
    
        await service.queryActionNoParams(querydeleteProject);

        successArr.push(Transuccess.deleteSuccess('dự án'));
        req.flash('Success', successArr);
        return res.redirect('/admin/projects');


    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/projects');
    }
}

let getProjectPageLoad = async (req, res, next) => {
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
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}

let getAllProjectDesc = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table  
        const query = `SELECT * FROM project ORDER BY id DESC`;

        pool.query(`SELECT * FROM project ORDER BY id DESC`, function (error, results, fields) {
            if (error) throw error;
            res.render('admin/projects/projects', {
                title: 'Dự án',
                projects: results.slice(0, 10),
                query, query,
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

module.exports = {
    getAllProject,
    addProjectGet,
    addProjectPost,
    checkSkuMatchProject,
    addProjectImage,
    searchDataProject,
    editProjectGet,
    editProjectPost,
    editProjectImage,
    updateProjectImagePost,
    addProjectImage,
    deleteProjectImage,
    deleteProjectController,
    getProjectPageLoad,
    getAllProjectDesc
};