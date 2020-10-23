var pool = require('../../../config/connectDb');


// get all company-feature
let FrAllFeatureCompany = async (req, res, next) => {
    try {
        await pool.query('SELECT * FROM feature_company', function (error, rows, fields) {
            if (error) throw error;
            res.render('admin/website/feature-company/features', {
                title: 'Lý do chọn Đất vàng',
                company_features: rows,
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
module.exports = {
    FrAllFeatureCompany,
};