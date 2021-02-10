var util = require('util');
function ResponseHandler() {

}

function ResponseBody() {
    this.status = "failure";
    this.count = null;
    this.error = null;
}

ResponseHandler.handleSuccess = function (res, data) {
    var response = new ResponseBody();
    response.status = "success";
    response.result = data;
    if (util.isArray(data)) {
        response.count = data.length;
    }
    else {
        //data must be an object, hence setting count as 1
        response.count = 1;
    }
    res.status(200).send(response);
}

ResponseHandler.handleError = function (res, error) {
    var response = new ResponseBody();
       response.result = null;
       response.count = 0;
	   response.error = error;
       res.status(200).send(response);
}


module.exports = ResponseHandler;