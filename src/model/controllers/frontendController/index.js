
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
    FrBlogCategoryController,
    searchBlogData,
    getPageLoadBlog } = require('./blogController');


const { FrProductController,
    FrProductDetailController,
    getAllProductCategory,
    getAllProductLocation,
    searchData,
    getAllProductDesc,
    getPageLoad } = require('./productController');

const {notFoundController,
    successController } = require('./notFoundController');

module.exports = {
    
    FrhomeController,
    FrAboutController,

    FrContactController,
    FrSendmailController,

    FrBlogController,
    FrBlogDetailController,
    FrBlogCategoryController,
    searchBlogData,
    getPageLoadBlog,

    FrProductController,
    FrProductDetailController,
    getAllProductCategory,
    getAllProductLocation,
    searchData,
    getAllProductDesc,
    getPageLoad,


    FrProjectController,
    FrProjectDetailController,


    // policy
    FrgetAllPolicy,
    FrgetPolicyDetails,


    notFoundController,
    successController
}