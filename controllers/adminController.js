let responseHandler=require('../utils/ResponseHandler');
let adminService=require('../services/adminService');


exports.addRole=function(req,res){
    console.log("req.body-------------",req.body)
	adminService.addRole(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.updateRole=function(req,res){
    console.log("req.body-------------",req.body)
	adminService.updateRole(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.rolesList=function(req,res){
    console.log("req.body-------------",req.body)
	adminService.rolesList(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.agencies=function(req,res){
	console.log("agencies--------------------")
	adminService.agencies(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}