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

var productUploadFile = multer({ storage: storage }).any('product-images', 4);
var productUpdateFile = multer({ storage: storage }).single('product-image', 1);
// Lấy danh sách sản phẩm.
let getAllProduct = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        const querylocations = 'SELECT * FROM locations';
        const locations = await service.getAllLocations(querylocations);
        const queryCategories = 'SELECT * FROM categories';
        const categories = await service.getAllCategoryProduct(queryCategories);
        const query = `SELECT * FROM product`;
        pool.query('SELECT * FROM product', function (error, results, fields) {
            if (error) throw error;
            res.render('admin/products/products', {
                title: 'Sản phẩm',
                query: query,
                products: results.slice(0, 10),
                locations: locations,
                categories: categories,
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
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}

let getAllProductCategory = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        const querylocations = 'SELECT * FROM locations';
        const locations = await service.getAllLocations(querylocations);        const queryCategories = 'SELECT * FROM categories';
        const categories = await service.getAllCategoryProduct(queryCategories);
        const query = `SELECT * FROM product WHERE category_id = ${req.params.idcategory}`;
        pool.query(`SELECT * FROM product WHERE category_id = ${req.params.idcategory}`, function (error, results, fields) {
            if (error) throw error;
            res.render('admin/products/products', {
                title: 'Sản phẩm',
                products: results.slice(0, 10),
                query: query,
                locations: locations,
                categories: categories,
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

let getAllProductLocation = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        const querylocations = 'SELECT * FROM locations';
        const locations = await service.getAllLocations(querylocations);        
        const queryCategories = 'SELECT * FROM categories';
        const categories = await service.getAllCategoryProduct(queryCategories);
        const query = `SELECT * FROM product WHERE location_id = ${req.params.idlocation}`;
        pool.query(`SELECT * FROM product WHERE location_id = ${req.params.idlocation}`, function (error, results, fields) {
            if (error) throw error;
            res.render('admin/products/products', {
                title: 'Sản phẩm',
                products: results.slice(0, 10),
                query: query,
                locations: locations,
                categories: categories,
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

let getAllProductDesc = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        const querylocations = 'SELECT * FROM locations';
        const locations = await service.getAllLocations(querylocations);        
        const queryCategories = 'SELECT * FROM categories';
        const categories = await service.getAllCategoryProduct(queryCategories);
        const query = `SELECT * FROM product ORDER BY id DESC`;

        pool.query(`SELECT * FROM product ORDER BY id DESC`, function (error, results, fields) {
            if (error) throw error;
            res.render('admin/products/products', {
                title: 'Sản phẩm',
                products: results.slice(0, 10),
                query, query,
                locations: locations,
                categories: categories,
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
let addProductGet = async (req, res, next) => {
    try {
        var querycategories = 'SELECT * FROM categories';
        var querylocations = 'SELECT * FROM locations';
        var categories = await service.queryActionNoParams(querycategories);
        var locations = await service.queryActionNoParams(querylocations);
        pool.query('SELECT * FROM brand', function (error, results, fields) {
            res.render('admin/products/addproduct', {
                title: 'Thêm sản phẩm',
                brands: results,
                categories: categories,
                locations: locations,
                user: req.user
            });
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}
// thêm thuộc tính vào sản phẩm
let addProductAttribute = async (req, res, next) => {
    try {
        var result = {
            message: 'Thành công rồi !',
            attributes: [],
            type: '',
            attribute_id: '',
            attribute_name: '',
            id: req.body.id
        }
        var queryattributeValue = `
        SELECT prd_attribute_value.id, 
        prd_attribute_value.name, 
        attributes.id as attribute_id, attribute_name 
        FROM prd_attribute_value 
        LEFT JOIN attributes 
        ON prd_attribute_value.attribute_id=attributes.id 
        WHERE attributes.id = ?`;

        var queryAttributeType = `SELECT type FROM attributes WHERE attributes.id = ?`;
        var queryattribute = `SELECT * FROM attributes WHERE attributes.id = ?`;
        var attributeType = await service.queryAction(queryAttributeType, result.id);

        if (attributeType[0].type == 2) {
            await pool.query(queryattributeValue, result.id, async function (error, results, fields) {

                // trường hợp attribute value chưa có dữ liệu.

                if (!results[0]) {
                    var queryNewAttributeVal = `
                    INSERT INTO 
                    prd_attribute_value(attribute_id, name, slug)
                    VALUES (${req.params.id},"dữ liệu mẫu","du-lieu-mau")`;

                    await service.addExampleAttribute(queryNewAttributeVal);
                    let allAttribute = await service.queryAllAttribute(queryattributeValue, result.id);

                    result.attributes = allAttribute;
                    result.attribute_id = allAttribute[0].attribute_id;
                    result.attribute_name = allAttribute[0].attribute_name;
                    result.type = attributeType[0].type;
                    return res.status(200).send(result);

                } else {
                    result.attributes = allAttribute;
                    result.attribute_id = allAttribute[0].attribute_id;
                    result.attribute_name = allAttribute[0].attribute_name;
                    result.type = attributeType[0].type;
                    return res.status(200).send(result);
                }
            });
        } else {
            await pool.query(queryattribute, result.id, function (error, results, fields) {
                result.attributes = results;
                result.type = attributeType[0].type;
                result.attribute_id = results[0].id;
                result.attribute_name = results[0].attribute_name;
                return res.status(200).send(result);
            });
        }
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}
// kiểm tra mã Sku
let checkSkuMatch = async (req, res, next) => {
    let sku = req.body.sku;
    let results = {};
    var queryCheckSkuMatch = `SELECT * FROM product WHERE sku = '${req.body.sku}'`;
    await service.checkSkuMatch(queryCheckSkuMatch)
        .then((value) => {
            results.success = value;
            res.status(200).send(results);
        }).catch(function (e) {
            res.status(500).send(e);
            return false;
        });
}
// add more product
let addProductPost = (req, res, next) => {
    let productItem = [];
    let successArr = [];
    let arrayError = [];
    productUploadFile(req, res, async (error) => {
        try {
            productItem[0] = req.body.product_sku;
            productItem[1] = req.body.product_category;
            productItem[2] = req.body.product_name;
            productItem[3] = req.body.product_slug;
            productItem[4] = req.body.product_price;
            productItem[5] = `${req.body.image_path}` || '';
            productItem[6] = req.body.propduct_description;
            productItem[7] = req.body.short_description;
            productItem[8] = req.body.product_meta_title;
            productItem[9] = req.body.product_meta_keyword;
            productItem[10] = req.body.product_meta_description;
            if (req.body.product_quantity <= 0 || req.body.product_quantity == '') {
                productItem[11] = 0;
            }
            productItem[11] = 1;
            productItem[12] = req.body.product_quantity;
            productItem[13] = req.body.propduct_description_details;
            productItem[14] = req.body.product_location;
            productItem[15] = req.body.product_address;
            productItem[16] = req.body.product_square;
            productItem[17] = req.body.product_view;
            let current_datetime = new Date()
            let formatted_date = current_datetime.
            getDate() + "-" + (current_datetime.
                getMonth() + 1) + "-" + current_datetime.
                getFullYear();
            productItem[18] = formatted_date;

            var queryNewProduct = `
            INSERT INTO 
            product(
                sku, 
                category_id,
                name,
                slug, 
                price, 
                image, 
                description, 
                short_description,
                meta_title,
                meta_keywords,
                meta_description,
                stock,
                quantity,
                description_details,
                location_id,
                address,
                square,
                view,
                create_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;


            console.log('Danh sách hình ảnh được thêm vào');
            console.log(req.body.image_path);

            // tạo mới sản phẩm
            await service.newProduct(queryNewProduct, productItem);
            // lấy được id sản phẩm vửa tạo.
            var id = await service.getlastProduct('SELECT MAX(ID) as id FROM product');
            // thêm vào chuỗi query;
            successArr.push(Transuccess.createSuccess('sản phẩm'));
            req.flash('Success', successArr);
            return res.redirect('/admin/products');

        } catch (error) {
            arrayError.push('Có lỗi xảy ra');
            req.flash('errors', arrayError);
            res.redirect('/admin/products');
        }
    })
}
// Thêm hình ảnh sản phẩm
let addProductImage = (req, res, next) => {
    productUploadFile(req, res, (error) => {
        let successArr = [];
        let arrayError = [];
        try {
            //thực hiện báo về cho protend;
            if (req.files) {
                console.log('Danh sách hình ảnh mởi được thêm vào');
                console.log(req.files);
                req.files.map(async (file) => {
                    try {
                        await sharp(file.path).resize(500, 300).toBuffer(function (err, buffer) {
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
            res.redirect('/admin/products');
            return res.status(500).send(error);
        }
    })
}
// edit product info Get
let editProductGet = async (req, res, next) => {
    var arrayError = [],
        successArr = [];
    try {
        var product_id = parseInt(req.params.id);
        if (typeof product_id !== "number") {
            res.render('admin/notfound/notfound', {
                title: 'Trang Không tìm thấy'
            });
        }
        var queryCheckId = `SELECT id FROM product WHERE id = ${req.params.id}`;
        var idProduct = await service.queryActionNoParams(queryCheckId);

        if (idProduct.length <= 0) {
            res.render('admin/notfound/notfound', {
                title: 'Trang Không tìm thấy'
            });
        }

        var query = `SELECT * FROM product where id= ${product_id}`;


        var querycategories = 'SELECT * FROM categories';
        // danh sách dữ liệu thuộc tính sản phẩm
        var categories = await service.queryActionNoParams(querycategories);
        var querylocations = 'SELECT * FROM locations';
        var locations = await service.queryActionNoParams(querylocations);
        // lấy danh sách hình ảnh của sản phẩm.
        pool.query(query, function (error, rows, fields) {
            if (error) throw error;
            var images = '';
            var count = '';
            var imagesArr = [];
            if (rows[0].image != '') {
                images = JSON.parse(rows[0].image);
                imagesArr = Object.keys(images);
            }
            var option = {
                title: 'Chỉnh Sửa Sản Phẩm',
                product: rows[0],
                categories: categories,
                locations: locations,
                images: images,
                imagearr: imagesArr,
                user: req.user,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            }
            res.render('admin/products/editProduct', option);
        })
    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}
// edit product post
let editProductPost = (req, res, next) => {
    let productItem = [];
    let successArr = [];
    let arrayError = [];
    productUploadFile(req, res, async (error) => {
        try {
            var product_id = req.params.id;
            var queryUpdate = `UPDATE product
            SET  
            sku = ?, 
            category_id = ?,
            name = ?,
            slug = ?, 
            price = ?,
            image = ?, 
            description = ?, 
            short_description = ?,
            meta_title = ?,
            meta_keywords = ?,
            meta_description = ?,
            stock = ?,
            quantity = ?,
            description_details = ?,
            location_id = ?,
            address = ?,
            square = ?,
            view = ?,
            create_at = ?
            WHERE id = ?`;

            productItem[0] = req.body.product_sku
            productItem[1] = req.body.product_category;
            productItem[2] = req.body.product_name;
            productItem[3] = req.body.product_slug;
            productItem[4] = req.body.product_price;

            var query = `SELECT image from product WHERE id = ${req.params.id}`
            var imageLink = await service.getImageProduct(query);
            // kiểm tra hình ảnh up lên vào cập nhật vàn danh sách
            if (imageLink[0].image == '' && req.body.image_path != '') {
                productItem[5] = req.body.image_path;
                console.log('Danh sách hình ảnh được thêm vào');
                console.log(req.body.image_path);
            }
            else if (imageLink[0].image != '' && req.body.image_path != '') {
                var Obj = JSON.parse(imageLink[0].image);
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
                console.log('danh sách hình ảnh được up lên');
                console.log(productItem[5]);
                console.log('Danh sách hình ảnh được thêm vào');
                console.log(req.body.image_path);
            } else {
                productItem[5] = imageLink[0].image;
                console.log('Danh sách hình ảnh được thêm vào');
                console.log(req.body.image_path);
            }
            productItem[6] = req.body.propduct_description;
            productItem[7] = req.body.short_description;
            productItem[8] = req.body.product_meta_title;
            productItem[9] = req.body.product_meta_keyword;
            productItem[10] = req.body.product_meta_description;

            if (req.body.product_quantity <= 0) {
                productItem[11] = 0;
            }
            productItem[11] = 1;
            productItem[12] = req.body.product_quantity;
            productItem[13] = req.body.propduct_description_details;
            productItem[14] = req.body.product_location;
            productItem[15] = req.body.product_address;
            productItem[16] = req.body.product_square;
            productItem[17] = req.body.product_view;
            let current_datetime = new Date()
            let formatted_date = current_datetime.
            getDate() + "-" + (current_datetime.
                getMonth() + 1) + "-" + current_datetime.
                getFullYear();
            productItem[18] = formatted_date;
            productItem[19] = req.params.id;

            await pool.query(queryUpdate, productItem, function (error, results, fields) {
                if (error){
                    arrayError.push('Có lỗi xảy ra, Vui lòng xóa các ký tự icons không định dạng được trong văn bản !');
                    req.flash('errors', arrayError);
                    res.redirect('/admin/product/edit-product/' + req.params.id);
                }
                successArr.push(Transuccess.createSuccess(' Chỉnh sửa sản phẩm thành công '));
                req.flash('Success', successArr);
                return res.redirect('/admin/product/edit-product/' + + req.params.id);
            });

        } catch (error) {
            arrayError.push('Có lỗi xảy ra, Vui lòng xóa các ký tự icons không định dạng được trong văn bản !');
            req.flash('errors', arrayError);
            res.redirect('/admin/product/edit-product/' + req.params.id);
        }
    })
}
// lấy hình ảnh được sửa update để gửi xuống cho client
let editProductImage = (req, res, next) => {
    productUpdateFile(req, res, async (error) => {
        try {
            var product_id = req.params.id;
            var image_index = req.query.index;
            var query = `SELECT image from product WHERE id = ${product_id}`
            var imageLink = await service.getImageProduct(query);
            var Obj = JSON.parse(imageLink[0].image);
            var result = {
                id: req.params.id,
                index: req.query.index,
                imageName: Obj[image_index],
            }
            return res.status(200).send(result);

        } catch (error) {
            arrayError.push('Có lỗi xảy ra');
            req.flash('errors', arrayError);
            res.redirect('/admin/products/edit-product');
        }
        // Everything went fine
    })
}
// thực hiện update hình ảnh đã được chọn lên server
let updateProductImagePost = (req, res, next) => {
    productUpdateFile(req, res, async (error) => {
        var arrayError = [],
            successArr = [];
        try {
            if (req.file) {
                var product_id = req.params.id;
                var index = req.query.index;
                var dateUpdate = Date.now();
                await sharp(`${req.file.destination}/${req.file.filename}`)
                    .resize(500, 300)
                    .toFile(`${req.file.destination}/${dateUpdate}-${req.file.filename}`, (err, info) => {
                        fs.unlinkSync(req.file.path);
                    });
                var filename = '';
                if (req.file) {
                    filename = `${dateUpdate}-${req.file.filename}`;
                }
                var query = `SELECT image from product WHERE id = ${product_id}`
                var imageLink = await service.getImageProduct(query);
                // lấy da được object.
                var Obj = JSON.parse(imageLink[0].image);
                var old_image = Obj[index];
                Obj[index] = filename;
                Obj = JSON.stringify(Obj);
                await fsExtras.remove(`${app.directory_products}/${old_image}`);
                var ProductValues = [
                    Obj,
                    product_id
                ];
                var queryUpdateImage = `
                UPDATE product
                SET image = ? 
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
// Xóa cụ thể hình ảnh sản phẩm
let deleteProductImage = async (req, res, next) => {
    let successArr = [];
    try {
        var product_id = req.params.id;
        var index = req.query.index;
        var query = `SELECT image from product WHERE id = ${product_id}`
        var imageLink = await service.getImageProduct(query);

        var Obj = JSON.parse(imageLink[0].image);
        var old_image = Obj[index];
        delete Obj[index];
        //await fsExtras.remove(`${app.directory_products}/${old_image}`);
        Obj = JSON.stringify(Obj);
        var ProductValues = [
            Obj,
            product_id
        ];
        var queryUpdateImage = `
        UPDATE product
        SET image = '${Obj}' 
        WHERE id = ${product_id}`;
        await pool.query(queryUpdateImage, function (error, results, fields) {
            if (error) throw error;
            successArr.push(Transuccess.deleteSuccess('Xóa hình ảnh thành công !'));
            req.flash('Success', successArr);
            return res.redirect('/admin/product/edit-product/' + product_id);
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}
let searchData = async (req, res, next) => {
    let successArr = [];
    try {
        var product_name = req.params.name;
        var queryBike = `
        SELECT * FROM product WHERE name LIKE 
        '%${product_name}%' 
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
        res.redirect('/admin/products');
    }
}
let deleteProductController = async (req, res, next) => {
    let successArr = [];
    try {
        var iddelete = req.params.iddelete;
       
        const querydeleteProduct = `DELETE FROM product where id = ${iddelete}`;
        const queryImage = `SELECT image FROM product WHERE id = ${iddelete}`;
        const images = await service.queryActionNoParams(queryImage);

        let imagesParse = '';
        let imagesArr = [];
        if (images[0].image != '') {
            imagesParse = JSON.parse(images[0].image);
            imagesArr = Object.keys(imagesParse);
            for (var i = 0; i < imagesArr.length; i++) {
                await fsExtras.remove(`${app.directory_products}/${imagesParse[imagesArr[i]]}`);
            }
        }
    
        await service.queryActionNoParams(querydeleteProduct);

        successArr.push(Transuccess.deleteSuccess('sản phẩm'));
        req.flash('Success', successArr);
        return res.redirect('/admin/products');


    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/products');
    }
}


module.exports = {
    getAllProduct,
    addProductGet,
    addProductPost,
    editProductGet,
    addProductImage,
    addProductAttribute,
    editProductImage,
    updateProductImagePost,
    deleteProductImage,
    editProductPost,
    deleteProductController,
    searchData,
    getAllProductCategory,
    getAllProductLocation,
    getAllProductDesc,
    getPageLoad,
    checkSkuMatch
};