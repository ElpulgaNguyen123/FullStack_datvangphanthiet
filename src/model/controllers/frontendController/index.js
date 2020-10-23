
// Frontend controller start
const FrhomeController = require('./homeController');
const FrAboutController = require('./aboutController');
const FrProjectController = require('./projectController');
const FrTermController = require('./termController');
const { FrContactController,
    FrSendmailController } = require('./contactController');
const { FrBlogController,
    FrBlogDetailController } = require('./blogController');


const { FrProductController,
    FrProductDetailController,
    getAllBikeCategory,
    getAllBikeBrand,
    searchData,
    getAllBikeDesc,
    getPageLoad } = require('./productController');

const {notFoundController } = require('./notFoundController');


module.exports = {
    FrhomeController,
    FrAboutController,

    FrContactController,
    FrSendmailController,

    FrBlogController,
    FrBlogDetailController,

    FrProductController,
    FrProductDetailController,
    getAllBikeCategory,
    getAllBikeBrand,
    searchData,
    getAllBikeDesc,
    getPageLoad,
    FrProjectController,

    FrTermController,
    notFoundController
}