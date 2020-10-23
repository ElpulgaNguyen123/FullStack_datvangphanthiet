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
        await pool.query('SELECT * FROM endow', function (error, rows, fields) {
            if (error) throw error;
            res.render('datvangphanthiet/notfound/notfound', {
                title: 'Trang Không tìm thấy',
                userInfo : userInfo,
                errors: req.flash('Errors'),
                success: req.flash('Success'),
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    notFoundController
};
