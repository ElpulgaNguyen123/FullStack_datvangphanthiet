var express = require('express');
var frontendRouter = express.Router();
var controller = require('../model/controllers/frontendController');

frontendRouter.get('/', controller.FrhomeController);
frontendRouter.get('/gioi-thieu', controller.FrAboutController);
frontendRouter.get('/lien-he', controller.FrContactController);
frontendRouter.post('/lien-he/send-mail', controller.FrSendmailController);

// blog / start
frontendRouter.get('/blog', controller.FrBlogController);
frontendRouter.get('/blog/*.:id', controller.FrBlogDetailController);
// blog / end

// product / start
frontendRouter.get('/san-pham', controller.FrProductController);
frontendRouter.get('/xe-dap/danh-muc/*.:iddanhmuc', controller.getAllBikeCategory);
frontendRouter.get('/xe-dap/thuong-hieu/*.:idthuonghieu', controller.getAllBikeBrand);
frontendRouter.get('/xe-dap/giam-dan', controller.getAllBikeDesc);
frontendRouter.get('/san-pham/*.:id', controller.FrProductDetailController);
frontendRouter.get('/xe-dap/search/:name', controller.searchData);
frontendRouter.get('/xe-dap/giam-dan',controller.getAllBikeDesc);
frontendRouter.post('/xe-dap/get-more/:page',controller.getPageLoad);
// product / end

frontendRouter.get('/du-an',controller.FrProjectController);


// chinh sach và phap ly / start
frontendRouter.get('/phap-ly',controller.FrgetAllPolicy);
frontendRouter.get('/phap-ly/*.:id',controller.FrgetPolicyDetails);
// chinh sach và phap ly / end

// not founds page
frontendRouter.use(controller.notFoundController);

module.exports = frontendRouter;    