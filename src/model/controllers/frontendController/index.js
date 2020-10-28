
// Frontend controller start
const FrhomeController = require('./homeController');
const FrAboutController = require('./aboutController');
const {FrProjectController,
    FrProjectDetailController} = require('./projectController');
const {FrgetAllPolicy,
    FrgetPolicyDetails} = require('./policiesController');
const { FrContactController,
    FrSendmailController } = require('./contactController');
const { FrBlogController,
    FrBlogDetailController,
    FrBlogCategoryController } = require('./blogController');


const { FrProductController,
    FrProductDetailController,
    getAllProductCategory,
    getAllProductLocation,
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
    getAllProductCategory,
    getAllProductLocation,
    searchData,
    getAllBikeDesc,
    getPageLoad,


    FrProjectController,
    FrProjectDetailController,


    // policy
    FrgetAllPolicy,
    FrgetPolicyDetails,


    notFoundController
}