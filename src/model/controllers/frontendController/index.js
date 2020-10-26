
// Frontend controller start
const FrhomeController = require('./homeController');
const FrAboutController = require('./aboutController');
const FrProjectController = require('./projectController');
const {FrgetAllPolicy,
    FrgetPolicyDetails} = require('./policiesController');
const { FrContactController,
    FrSendmailController } = require('./contactController');
const { FrBlogController,
    FrBlogDetailController,
    FrBlogCategoryController } = require('./blogController');


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
    FrBlogCategoryController,

    FrProductController,
    FrProductDetailController,
    getAllBikeCategory,
    getAllBikeBrand,
    searchData,
    getAllBikeDesc,
    getPageLoad,
    FrProjectController,


    // policy
    FrgetAllPolicy,
    FrgetPolicyDetails,


    notFoundController
}