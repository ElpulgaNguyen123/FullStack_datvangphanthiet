var pool = require('../../../config/connectDb');
var app = require('../../../config/app');
var service = require('../../../../services');
var multer = require('multer');
var { uuid } = require('uuidv4');
var { Transuccess, Tranerrors } = require('../../../../../lang/vi');
var sharp = require('sharp');
var fs = require('fs');
var fsExtras = require('fs-extra');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, app.directory_products);
        cb(null, app.directory_staffs);
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
var productUploadFile = multer({ storage: storage }).single('staff_avatar');
// get all Blog
let getAllStaff = async (req, res, next) => {
    try {
        await pool.query('SELECT * FROM staffs', function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/staffs/staffs', {
                title: 'Nhân viên',
                staffs: rows,
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

// dẫn đến trang thêm nhân viên
let addStaffGet = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var user = req.user || {};
        res.render('admin/website/staffs/add-staff', {
            title: 'Thêm nhân viên',
            errors: req.flash('Errors'),
            success: req.flash('Success'),
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
// thêm nhân viên
let addStaffPost = (req, res, next) => {
    productUploadFile(req, res, (error) => {
        try {
            var arrayError = [],
                successArr = [];
            var generatecode = uuid();
            if (req.file) {
                // resize image before uploads.
                sharp(`${req.file.destination}/${req.file.filename}`)
                    .resize(600, 600)
                    .toFile(`${req.file.destination}/${req.file.filename}-${generatecode}.webp`, (err, info) => {
                        fs.unlinkSync(req.file.path);
                    });
            }
            var filename = '';
            if (req.file) {
                filename = `${req.file.filename}-${generatecode}.webp`;
            }
            var queryNewStaff = 'INSERT INTO staffs (staff_name, staff_position, staff_slogan, staff_avatar) VALUES ?';
            var staffValues = [
                [req.body.staff_name,
                req.body.staff_position,
                req.body.staff_slogan,
                    filename]
            ];
            pool.query(queryNewStaff, [staffValues], async function (error, results, fields) {
                if (error) {
                    fsExtras.remove(`${app.directory_staffs}/${filename}`);
                    arrayError.push(Tranerrors.saveError('nhân viên'));
                    req.flash('Errors', arrayError);
                    res.redirect('/admin/staff/add-staff');
                };
                successArr.push(Transuccess.createSuccess('nhân viên'));
                req.flash('Success', successArr);
                res.redirect('/admin/staff/add-staff');
            });
        } catch (error) {
            arrayError.push(Tranerrors.saveError('nhân viên'));
            req.flash('Errors', arrayError);
            res.redirect('/admin/staff/add-staff');
        }
    })
}
// lấy thông tin chỉnh sửa nhân viên
let getEditStaff = async (req, res, next) => {
    try {
        var staff_id = req.params.id;
        var arrayError = [],
            succesArr = [];
        var query = `SELECT * FROM staffs WHERE id = ?`;
        // Lấy tất cả sản phẩm và hiển thị ra table
        await pool.query(query, staff_id, function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/staffs/edit-staff', {
                title: 'Chỉnh sửa nhân viên',
                staff: rows[0],
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
// lấy thông tin chỉnh sửa thương hiệu gửi lên update lên server
let postEditStaff = (req, res, next) => {
    productUploadFile(req, res, async (error) => {
        try {
            // Lấy tất cả sản phẩm và hiển thị ra table
            var arrayError = [],
                successArr = [];
            var generatecode = uuid();
            if (req.file) {
                // resize image before uploads.
                sharp(`${req.file.destination}/${req.file.filename}`)
                    .resize(600, 600)
                    .toFile(`${req.file.destination}/${req.file.filename}-${generatecode}.webp`, async (err, info) => {
                        fs.unlinkSync(req.file.path);
                        if (req.body.staff_old_image) {
                            await fsExtras.remove(`${app.directory_staffs}/${req.body.staff_old_image}`);
                        }
                    });
            }
            var filename = '';
            if (req.file) {
                filename = `${req.file.filename}-${generatecode}.webp`;
            }
            else if (req.body.staff_old_image) {
                filename = `${req.body.staff_old_image}`;
            }
            var queryUpdateStaff = `
            UPDATE staffs
            SET staff_name = ?, 
            staff_position = ?, 
            staff_slogan = ?,
            staff_avatar = ?
            WHERE id = ?`
            var staffValues = [
                req.body.staff_name,
                req.body.staff_position,
                req.body.staff_slogan,
                filename,
                req.params.id
            ]
            console.log(staffValues);
            await pool.query(queryUpdateStaff, staffValues, function (error, results, fields) {
                if (error) {
                    fsExtras.remove(`${app.directory_staffs}/${filename}`);
                    arrayError.push(Tranerrors.saveError('nhân viên'));
                    req.flash('Errors', arrayError);
                    res.redirect('/admin/staff/edit-staff/' + req.params.id);
                };
                successArr.push(Transuccess.saveSuccess('nhân viên'));
                req.flash('Success', successArr);
                res.redirect('/admin/staff/edit-staff/' + req.params.id);
            });
        } catch (error) {
            arrayError.push(Tranerrors.saveError('nhân viên'));
            req.flash('Errors', arrayError);
            res.redirect('/admin/staff/edit-staff/' + req.params.id);
        }
    })
}

// xóa dữ liệu của 1 brand
let postDeleteStaff = async (req, res, next) => {
    try {
        // Lấy tất cả sản phẩm và hiển thị ra table
        var arrayError = [],
            successArr = [];

        var staff_id = req.params.id;
        // Lấy tất cả sản phẩm và hiển thị ra table
        let queryStaff = 'SELECT * FROM staffs WHERE id = ?';
        var Image_delete = await service.getStaffService(queryStaff, staff_id);
        if (Image_delete[0].staff_avatar != null) {
            await fsExtras.remove(`${app.directory_staffs}/${Image_delete[0].staff_avatar}`);
        }
        var querydeleteStaff = `
        DELETE FROM 
        staffs 
        WHERE id = ${staff_id}`
        pool.query(querydeleteStaff, function (error, results, fields) {
            if (error) {
                arrayError.push('Có lỗi xảy ra');
                req.flash('errors', arrayError);
                res.redirect('/admin/staffs');
            };
            successArr.push(Transuccess.deleteSuccess('nhân viên'));
            req.flash('Success', successArr);
            res.redirect('/admin/staffs');
        });

    } catch (error) {
        arrayError.push('Có lỗi xảy ra');
        req.flash('errors', arrayError);
        res.redirect('/admin/staffs');
    }
}

module.exports = {
    getAllStaff,
    addStaffGet,
    addStaffPost,
    getEditStaff,
    postEditStaff,
    postDeleteStaff
};