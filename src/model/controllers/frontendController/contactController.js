var pool = require('../../config/connectDb');
const { query } = require('express');
const service = require('../../../services');
var { tranMail } = require('../../../../lang/vi');
var nodeMailer = require('nodemailer');

let FrContactController = async (req, res, next) => {
    try {
        let userInfo = {};
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if (user[0]) {
            userInfo = user[0];
        }

        let queryPolicies = 'SELECT * FROM policies';
        let policies = await service.getAllPolicies(queryPolicies);
        
        if(policies.length > 6){
            policies = policies.slice(0,6);
        }

        let queryBlogCatgories = 'SELECT * FROM blog_categories';
        let blog_categories = await service.getAllBlogCategories(queryBlogCatgories);

        var queryCategory = 'SELECT * FROM categories';        
        const categories = await service.getAllCategoryProduct(queryCategory);

        
        let queryProject = 'SELECT * FROM project';
        let projects = await service.getAllProject(queryProject);

        // Lấy tất cả sản phẩm và hiển thị ra table
        res.render('datvangphanthiet/contact/contact', {
            title: 'Liên hệ',
            projects:projects,
            policies : policies,
            categories:categories,
            blog_categories : blog_categories,
            userInfo: userInfo,
            errors: req.flash('Errors'),
            success: req.flash('Success'),
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}



let FrSendmailController = async (req, res, next) => {
    try {
        let customer = {};
        if(!req.body.customer_name){
            customer.name = '';
        }else{
            customer.name = req.body.customer_name;
        }
        if(!req.body.customer_phone){
            customer.phone = '';
        }else{
            customer.phone = req.body.customer_phone;
        }
        customer.email = req.body.customer_email;

        if(!req.body.customer_content){
            customer.content = ' Nhận email thông báo tin tức ';
        }else{
            customer.content = req.body.customer_content;
        }
        let email = '';
        var queryUser = 'SELECT * FROM user';
        var user = await service.getAllUser(queryUser);
        if (user) {
            email = user[0].email;
        }
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'nguyenhoangthang635@gmail.com',
                pass: 'Leo769183'
            },
            tls: {
                rejectUnauthorized: false,
            }
        };
        let transporter = nodeMailer.createTransport(smtpConfig);
        let options = {
            from: email,
            to: email,
            subject: tranMail.sendmailSubject,
            html: tranMail.sendmailInfo(customer)
        }
        // Sendmail
        await transporter.sendMail(options)
            .then((success) => {
                res.redirect('/thanh-cong');
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
module.exports = { FrContactController, FrSendmailController };