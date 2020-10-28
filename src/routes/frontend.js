var express = require('express');
var frontendRouter = express.Router();
var controller = require('../model/controllers/frontendController');

frontendRouter.get('/', controller.FrhomeController);
frontendRouter.get('/gioi-thieu', controller.FrAboutController);
frontendRouter.get('/lien-he', controller.FrContactController);
frontendRouter.post('/lien-he/send-mail', controller.FrSendmailController);

// blog / start
frontendRouter.get('/blogs', controller.FrBlogController);
frontendRouter.get('/blog/blog-category/*.:id', controller.FrBlogCategoryController);
frontendRouter.get('/blog/*.:id', controller.FrBlogDetailController);
// blog / end

// product / start
frontendRouter.get('/san-pham', controller.FrProductController);
frontendRouter.get('/danh-muc/*.:iddanhmuc', controller.getAllProductCategory);
frontendRouter.get('/san-pham/dia-diem/*.:idlocation', controller.getAllProductLocation);
frontendRouter.get('/san-pham/giam-dan', controller.getAllBikeDesc);
frontendRouter.get('/san-pham/*.:id', controller.FrProductDetailController);
frontendRouter.get('/san-pham/search/:name', controller.searchData);
frontendRouter.get('/san-pham/giam-dan',controller.getAllBikeDesc);
frontendRouter.post('/san-pham/get-more/:page',controller.getPageLoad);
// product / end

frontendRouter.get('/du-an/*.:id',controller.FrProjectDetailController);


// chinh sach và phap ly / start
frontendRouter.get('/phap-ly',controller.FrgetAllPolicy);
frontendRouter.get('/phap-ly/*.:id',controller.FrgetPolicyDetails);
// chinh sach và phap ly / end

// not founds page
frontendRouter.use(controller.notFoundController);

module.exports = frontendRouter;    