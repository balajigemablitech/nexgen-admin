'use strict'

let dbService = require("./dbService");
let async=require("async")
let responseHandler=require('../utils/ResponseHandler');
let helper=require("./helper")


module.exports= {
    addRole :(req,res,callback) =>{
       if(req.body.accessToken === req.body.accessToken){
          let persReq = {
             model: "AgencyRole",
             data:{
                agencyId:req.body.id,
                name:req.body.name,
                functions:req.body.functions
             }   
          }
          dbService.save(persReq,(err,data) => {
            if(err){
                responseHandler.handleError(res,err);
              }
              else{
                  let response={
                    accessToken:req.body.accessToken,
                    userId:req.session.userId,
                    role:req.body.name,
                    message:"Role created successfully."
                  }
                  let reqParams={
                     updatedBy:req.body.id,
                     operation:"Create",
                     function:"Role"
                  }
                  module.exports.saveAudit(reqParams);
                  
                //responseHandler.handleSuccess(res,response)
                return callback(null,response)
              }
          })
       }
       else{
           let error={
               "message":"AccessToken expired.Please login again."
           }
           return callback(error,null)
       }
       
    },

    updateRole : (req,res,callback) =>{
        let q = {
            f: { roleId: req.body.roleId },
            u: { 
                name:req.body.name,
                functions:req.body.functions
            },
            model: "AgencyRole"
        }
        dbService.update(q,(err,data) => {
            if(err){
                let error={
                    "message":"Role not updated.Please try again."
                }
                return callback(error,null)
            }
            else{
                let response={
                    accessToken:req.body.accessToken,
                    userId:req.session.userId,
                    roleId:req.body.roleId,
                    message:"Role updated successfully."
                }
                let reqParams={
                    updatedBy:req.body.id,
                    operation:"Update",
                    function:"Role"
                 }
                 module.exports.saveAudit(reqParams);
                  return callback(null,response)
            }
        });
    },

    rolesList : (req,res,callback) =>{
        let q = {
            filter: { agencyId: req.body.id },
            model: "AgencyRole",
            projection:{
                _id:0,
                name:1,
                functions:1
            }
        }
        dbService.fetchRecords(q,(err,docs) => {
            if(err){
                let error={
                    "message":"No roles found for this agency."
                }
                return callback(error,null)
            }
            else{
                let response={
                    accessToken:req.body.accessToken,
                    userId:req.body.id,
                    message:"Roles fetched successfully.",
                    roles:docs.result
                }
                  return callback(null,response)
            }
        });
    },

    saveAudit : (reqParams) =>{
        let auReq = {
            model: "AuditTrail",
            data:reqParams
          }
          dbService.save(auReq,(err,data) => {
          });
    },

    agencies :(req,res,callback) =>{
        let reqParams={
          model: "user",
          filter:{},
          projection:{
            _id:0
          }
        }
        dbService.fetchRecords(reqParams,function(err,docs){
            if(!err && docs && docs.count >0){
              
              let response={
                agencies:docs.result,
                accessToken:req.body.accessToken
              } 
              return callback(null,response) 
            }
            else{
              let error={
                "message":"No agencies found."
              }
              return callback(error,null)
            }
        });
    }

    
}