'use strict'

let dbService = require("./dbService");
let config=require("config")
let async=require("async")
let responseHandler=require('../utils/ResponseHandler');
let jwt = require("jsonwebtoken");
let emailUtils= require("../utils/emailUtils")
let mailConfig=require("../utils/mailConfig.js")
let randomString=require("randomstring")


module.exports= {
      signin : (req,res) =>{
        let reqParams={
          model: "user",
          filter : {
            "personalDetails.email": req.body.email,
            "personalDetails.password": req.body.password
          }
        }
        dbService.fetchRecords(reqParams,function(err,docs){
          console.log("docssss----------",docs)
            if(!err && (docs && docs.count >0 )){
              let user=docs.result[0]
              let roleId=user.roleId;
              var token = jwt.sign({ id: user.userId }, config.secret, {
                expiresIn: 3600 // 1 hour
              });
              console.log(req.session)
              req.session.accessToken=token;
              req.session.userId=user.userId;
              let roleParams={
                model: "AgencyRole",
                filter : {
                  "roleId": roleId
                }
              }
              dbService.fetchRecords(roleParams,function(err,roleDocs){
                if(!err && roleDocs && roleDocs.count >0){
                  let roles=roleDocs.result[0];
                  let response={
                    id: user.userId,
                    username: user.userName,
                    email: user.email,
                    accessToken: token,
                    role:roles.name,
                    functions:roles.functions
                  }
                  responseHandler.handleSuccess(res,response)
                }
                else{
                  let response={
                    id: user.userId,
                    username: user.userName,
                    email: user.email,
                    accessToken: token
                  }
                  responseHandler.handleSuccess(res,response)
                }
                
              });
              
            }
            else{
              responseHandler.handleError(res,{message:"Username/Password not match"})
            }
        })
         
      },

      saveAdminCred: (req,res) =>{
        let persReq = {
          model: "Admin",
          data:{
             email:"superadmin@nexgen.com",
             password:"superadmin"
          }   
        }

        dbService.save(persReq,(err,data) => {
           if(err){
             responseHandler.handleError(res,err);
           }
           else{
            responseHandler.handleSuccess(res,err);
           }
          });
      },

      register : (req, res) => {
        let userExists=false;
        let checkDuplicateUsernameOrEmail = (n) => {
          // Username
            let reqParams={
                model: "Registration",
                filter : {
                  "personalDetails.email": req.body.personalDetails.email
                }
            }
            dbService.fetchRecords(reqParams,function(err,docs){
                console.log('ddddddddddddddddd',err,docs);
                if(!err && (docs && docs.count >0 )){
                  userExists=true;
                }
                data=docs;
                return n();
            })
        }
       
        async.parallel([checkDuplicateUsernameOrEmail.bind()], () => {
          if(userExists){

            responseHandler.handleError(res,{ message: "User already exists!" })
          }
          else{
            let verificationCode=randomString.generate({
              length: 6,
              charset: 'alphanumeric'
            });
            let persReq = {
              model: "Registration",
              data:{
                personalDetails:req.body.personalDetails,
                poc:req.body.poc,
                account:req.body.account,
                status:"Requested",
                verificationCode:verificationCode,
		verificationStatus:0
              }   
            }
    
            dbService.save(persReq,(err,data) => {
               if(err){
                 responseHandler.handleError(res,err);
               }
               else{
                  let response={
                    message: "User was registered successfully!",
                    uid:data.result.registrationId
                  }
                  
                  let mailObj = mailConfig.mailCredentials();
                  let emailReqObj={
                    from: mailObj.mailInfo.from,
                    to: req.body.personalDetails.email,
                    //cc: cc,
                    subject: "Welcome To nexGen.com | Customer Registered",
                    template: "agencyRegRequest",
                    context:{
                      username:req.body.personalDetails.agency,
                      code:verificationCode
                    }
                  }
                  emailUtils.sendMail(emailReqObj,()=>{
                    responseHandler.handleSuccess(res,response)
                  })
                  
               }
            })
          }
         
               
        })
      },

      uniqueEmail : (req,res)=>{
        let email=req.params.emailID;
        let reqParams={
            model: "Registration",
            filter : {
              "personalDetails.email": email
            }
         }
        dbService.fetchRecords(reqParams,function(err,docs){
            if(!err && (docs && docs.count >0 )){
              // let response={
              //   uid:docs.result[0].registrationId
              // }
              let response={
                "status": "success",
                "count": docs.count,
                "error":null,
                "result": false
              }
              res.status(200).send(response);
            }
            else{
              if(err && err.error == "No Doc's Found"){
                let response={
                  "status": "success",
                  "count": 0,
                  "error":null,
                  "result": true
                }
                res.status(200).send(response);
              }
              else{
                let error={
                  message:"No records found"
                }
                responseHandler.handleError(res,error);
              }
              
            }
        })
      },

      resetpassword : (req,res) =>{
        let reqParams={
          model: "user",
          filter : {
            "personalDetails.email": req.body.email
          }
        }
        dbService.fetchRecords(reqParams,function(err,docs){
            if(!err && (docs && docs.count >0 )){
              let user=docs.result[0]
              let response={
                message:"Password has been sent to your email."
              }
              let mailObj = mailConfig.mailCredentials();
              let emailReqObj={
                from: mailObj.mailInfo.from,
                to: req.body.email,
                //cc: cc,
                subject: "Reset Password",
                template: "forgotPassword",
                context:{
                  password:user.personalDetails.password
                }
              }
              emailUtils.sendMail(emailReqObj,()=>{
                    responseHandler.handleSuccess(res,response)
              })
              
            }
            else{
              responseHandler.handleError(res,{message:"User does not exist."})
            }
        })
         
      },

      changepassword :(req,res,cb) =>{
        let reqParams={
          model: "user",
          filter : {
            "personalDetails.email": req.body.email
          }
        }
        dbService.fetchRecords(reqParams,function(err,docs){
            if(!err && (docs && docs.count >0 )){
              let user=docs.result[0];
              if(user.personalDetails.password === req.body.oldpassword){
                let persReq = {
                  model: "user",
                  f:{
                    "personalDetails.email":req.body.email,
                    "personalDetails.password":req.body.oldpassword
                  },
                  u:{
                    "personalDetails.password":req.body.newpassword
                  }   
                }
                dbService.updateOnly(persReq,(err,data) => {
                   let response={
                      message:"Password has been updated successfully."
                   }
                   return cb(null,response)
                });
              }
              else{
                let error={
                  message :"Old password does not match."
                }
                return cb(error,null)
              }
            }
            else{
                let error={
                  message :"User does not exist."
                }
                return cb(error,null)
            }
        })
      },

      emailVerify : (req,res) =>{
        console.log("emil--------------",req.body.emailId)
        let reqParams={
          model: "Registration",
          filter : {
            "personalDetails.email": req.body.emailId
          }
        }
        dbService.fetchRecords(reqParams,function(err,docs){
          console.log("---------------db records",docs)
            if(!err && (docs && docs.count >0 )){
              let user=docs.result[0];
              if(user.verificationStatus && user.verificationStatus === 1){
                let response={
                  message:"Verification code already verified.",
                  count:2
                }
                responseHandler.handleSuccess(res,response)
              }
              else{
                let verificationCode=user.verificationCode;
                if(verificationCode === req.body.verificationCode){
                    let q={
                      model: "Registration",
                      f : {
                        "personalDetails.email": req.body.emailId
                      },
                      u:{verificationStatus :1 }
  
                    }
                    dbService.update(q,(err,data) => {
                    });
            
  
                  let response={
                    message:"Agency registered successfully."
                  }
                  let mailObj = mailConfig.mailCredentials();
                  let emailReqObj={
                    from: mailObj.mailInfo.from,
                    to: req.body.email,
                    //cc: cc,
                    subject: "Registered successfully",
                    template: "registerSuccess",
                    context:{
                      username:user.personalDetails.email
                    }
                  }
                  emailUtils.sendMail(emailReqObj,()=>{
                        responseHandler.handleSuccess(res,response)
                  })
                }
                else{
                  responseHandler.handleError(res,{message:"Verification code does not match."})
                }
              }
             
            }
            else{
              responseHandler.handleError(res,{message:"User does not exist."})
            }
        })
      },

      approveAgency :(req,res,callback)=>{
        let reqParams={
          model: "Registration",
          filter : {
            "registrationId": req.body.uid
          }
        }
        dbService.fetchRecords(reqParams,function(err,docs){
          if(!err && (docs && docs.count >0 )){
            let register=docs.result[0];
            let agencyReq={
              model:"agency",
              data:{
                name: register.personalDetails.agency,
                isMain:req.body.isMain, //(for check main aganecy or sub agency),
                parentAgencyId: req.body.parentAgencyId,//(for sub agency, store parent agency id)
                enable:true,
                validityFrom: new Date(req.body.validityFrom),
                validityTo: new Date(req.body.validityTo),
                channelType:req.body.channelType
              }
              
            }
            dbService.save(agencyReq,(agencyerr,agencyData) => {
               if(agencyerr){
                let error={
                  "message":"Agency is not created. Please check with admin team."
                }
                return callback(error,null);
               }
               else{
                 let agencyId=agencyData.result.agencyId;
                  let functions=[
                    {
                      "menu":["profile"],
                      "subMenus":["profileView","profileCreate","profileDelete"]
                    },
                    {
                      "menu":["changeLogo"],
                      "subMenus":["ChangeLogoView","ChangeLogoCreate","ChangeLogoDelete"]
                    },
                    {
                      "menu":["Roles"],
                      "subMenus":["roleView","roleCreate","roleDelete"]
                    },
                    {
                      "menu":["Employees"],
                      "subMenus":["employeesView","employeesCreate","employeesDelete"]
                    },
                    {
                      "menu":["Bookings"],
                      "subMenus":["bookingsView","bookingsCreate","bookingsDelete"]
                    }
                  ]
               
                    let agencyRoleReq = {
                      model: "AgencyRole",
                      data:{
                        agencyId:agencyId,
                        name:"Admin",
                        functions:functions
                      }   
                    }
                    dbService.save(agencyRoleReq,(err,roledata) => {
                      if(roledata.count>0){
                        let roleId=roledata.result.roleId;
                          let userReq={
                            model:"user",
                            data:{
                              personalDetails:register.personalDetails,
                              account:register.account,
                              poc:register.poc,
                              enable: true,
                              agencyId:agencyId,
                              roleId:roleId
                            }
                            
                          }
                          dbService.save(userReq,(usererr,userData) => {
                              if(!usererr && userData){
                                  let data={
                                    userId:userData.result.userId,
                                    message:"Agency is approved successfully.",
                                    name:userData.result.personalDetails.agency
                                  }
                                  let reqParams={
                                    model: "Registration",
                                    filter : {
                                      "registrationId": req.body.uid
                                    }
                                  }
                                  let q = {
                                    f: { "registrationId": req.body.uid },
                                    u: { 
                                        status:"Approved"
                                    },
                                    model: "Registration"
                                 }
                                dbService.update(q,(err,data) => {
                                });
                                return callback(null,data);
                              }
                              else{
                                let error={
                                  "message":"Agency user is not created. Please check with admin team."
                                }
                                return callback(error,null)
                              }
                          });
                      }
                      else{
                        let error={
                          "message":"Agency role is not created. Please check with admin team."
                        }
                        return callback(error,null);
                      }
                  });
                }
              });
            }
            else{
                let error={
                  "message":"Agency does not exist. Please register the agency."
                }
                return callback(error,null)
             } 
             
          });
      },

     

      deleteUsers: (req,res,callback) =>{
        let reqParams={
          model: "Registration",
          filter:{}
        }
        dbService.deleteMany(reqParams,function(err,docs){
            if(!err && docs && docs.count >0){
              let response={
                message:"Deleted users successfully."
              } 
              return callback(null,response) 
            }
            else{
              let error={
                "message":"No users found."
              }
              return callback(error,null)
            }
        });
      },

      resendCode: (req,res,cb) =>{
          let mailObj = mailConfig.mailCredentials();
          let verificationCode=randomString.generate({
            length: 6,
            charset: 'alphanumeric'
          });
          let emailReqObj={
            from: mailObj.mailInfo.from,
            to: req.body.email,
            //cc: cc,
            subject: "nexGen.com | Verification Code",
            template: "verificationCode",
            context:{
              username:req.body.email,
              code:verificationCode
            }
          }
          emailUtils.sendMail(emailReqObj,()=>{
            let persReq = {
              model: "Registration",
              f:{
                "personalDetails.email":req.body.email
              },
              u:{
                verificationCode:verificationCode
              }   
            }
            dbService.updateOnly(persReq,(err,data) => {
            });
            return cb(null,{message:"Code is sent to your emailid.Please check it."});
          })
          
      },

      superAdminLogin: (req,res,cb) =>{
        let reqParams={
          model: "Admin",
          filter : {
            "email": req.body.email,
            "password": req.body.password
          }
        }
        dbService.fetchRecords(reqParams,function(err,docs){
          console.log("docssss----------",docs)
            if(!err && (docs && docs.count >0 )){
              let response={
                message:"Loggedin successfully.",
                result:docs
              } 
              return cb(null,response)
            }
            else{
              let error={
                message:"Username/Password not matched."
              }
              return cb(error,null)
            }
        });

      },


      allusers: (req,res,cb) =>{
        let reqParams={
          model: "Registration",
          filter:{},
          projection:{
            _id:0
          }
        }
        dbService.fetchRecords(reqParams,function(err,docs){
          if(!err && docs && docs.count >0){
              
            let response={
              users:docs.result
            } 
            return cb(null,response) 
          }
          else{
            let error={
              "message":"No agencies found."
            }
            return cb(error,null)
          }
        });
      }
     
}

