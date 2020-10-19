
// Frontend controller start
const FrhomeController = require('./homeController');
const FrAboutController = require('./aboutController');
const FrProjectController = require('./projectController');
const FrTermControler = require('./termController');
const {FrContactController,
    FrSendmailController} = require('./contactController');
const {FrBlogController,
    FrBlogDetailController} = require('./blogController');
    const {FrBikeController,
        FrBikeDetailController,
        getAllBikeCategory,
        getAllBikeBrand,
        searchData,
        getAllBikeDesc,
        getPageLoad} = require('./bikeController');


        
        

module.exports = {
    FrhomeController,
    FrAboutController,

    FrContactController,
    FrSendmailController,

    FrBlogController,
    FrBlogDetailController,

    FrBikeController,
    FrBikeDetailController,
    getAllBikeCategory,
    getAllBikeBrand,
    searchData,
    getAllBikeDesc,
    getPageLoad,

    FrProjectController,
    
    FrTermControler
}