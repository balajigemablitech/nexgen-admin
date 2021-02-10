let responseHandler=require('../utils/ResponseHandler');
let authService=require('../services/authService');


exports.signin=function(req,res){
	authService.signin(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.signup=function(req,res){
	authService.signup(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.uniqueEmail=function(req,res){
	authService.signup(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.resetpassword=function(req,res){
	authService.resetpassword(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.changepassword=function(req,res){
	authService.changepassword(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}


exports.approveAgency=function(req,res){
	authService.approveAgency(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}



exports.deleteUsers=function(req,res){
	authService.deleteUsers(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.resendVerificationCode=function(req,res){
	authService.resendCode(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.superAdminLogin=function(req,res){
	authService.superAdminLogin(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}

exports.allusers=function(req,res){
	authService.allusers(req,res,function(error,data){
		if(error){
			responseHandler.handleError(res,error);
		}else{
			responseHandler.handleSuccess(res,data);
		}
	})
	
}


