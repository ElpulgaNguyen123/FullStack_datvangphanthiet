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
frontendRouter.get('/xe-dap', controller.FrBikeController);
frontendRouter.get('/xe-dap/danh-muc/*.:iddanhmuc', controller.getAllBikeCategory);
frontendRouter.get('/xe-dap/thuong-hieu/*.:idthuonghieu', controller.getAllBikeBrand);
frontendRouter.get('/xe-dap/giam-dan', controller.FrBikeController);
frontendRouter.get('/xe-dap/*.:id', controller.FrBikeDetailController);
frontendRouter.get('/xe-dap/search/:name', controller.searchData);
frontendRouter.get('/xe-dap/giam-dan',controller.getAllBikeDesc);
frontendRouter.post('/xe-dap/get-more/:page',controller.getPageLoad);
// product / end


frontendRouter.get('/du-an',controller.FrProjectController);

frontendRouter.get('/dieu-kien-phap-ly',controller.FrTermControler);

module.exports = frontendRouter;