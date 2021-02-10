'use strict'

var express = require('express');
var router = express.Router();
var authService = require("../services/authService");
var emailUtils = require("../utils/emailUtils");
var adminController = require("../controllers/adminController");
var authController = require("../controllers/authController");



router.get('/', function(req,res,next){
	
	res.send("Welcome to Admin API")
});


router.post("/register",authService.register);
router.get("/register/isUnique/:emailID",authService.uniqueEmail);
//Agents and employee login
router.post("/b2b/login", authService.signin);
//superadmin login
router.post("/login", authController.superAdminLogin);

router.post("/resetpassword", authService.resetpassword);
router.post("/changepassword", authController.changepassword);
router.post("/register/emailVerify", authService.emailVerify);
router.post("/api/sendMail", emailUtils.sendMail);
router.post("/b2b/agency/newRole",adminController.addRole)
router.post("/b2b/agency/updateRole",adminController.updateRole)
router.post("/b2b/agency/roles",adminController.rolesList)
router.post("/b2b/agency/approveAgency",authController.approveAgency)
router.post("/b2b/agencies",adminController.agencies)
router.post("/b2b/deleteUsers",authController.deleteUsers)
router.post("/resendcode",authController.resendVerificationCode)

router.post("/allusers",authController.allusers)
router.post("/saveAdminCred",authService.saveAdminCred)






module.exports = router;
