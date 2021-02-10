
const axios = require('axios');


exports.requestUrl=(options,callback)=>{
	header = {'content-type': 'application/json','Accept-Language':'en-US','User-Agent':'Mozilla/5.0'};
	console.log(options.uri)
axios.get(options.uri,{ headers:header })
  .then(response => {
    //console.log(response.status);
    //console.log(response.data.explanation);
	    console.log(response.data);
    if(response.status=='200')
    callback(null,response.data)
    else callback('error code '+response.status,null)
  })
  .catch(error => {
	  console.log(error)
	  if(error&&error.response)
    callback(error.response.data,null)
    else callback({message:"connection error"},null)
  });
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

exports.requestPostUrl=(options,callback)=>{
  //console.log(options.uri)
  	header = {'content-type': 'application/json','Accept-Language':'en-US','User-Agent':'Mozilla/5.0'};
	  if(options.data){
      if (IsJsonString(options.data) == false) {
            data = JSON.stringify(options.data);
        }else data = options.data;
      }
	    const option = {
			  method: 'post',
			  headers: header,
			  data: data,
			  url:options.url
			}; 
	//console.log(JSON.stringify(data))
      axios(option)
        .then(response => {
          if(response.status=='200')
          callback(null,response.data)
          else callback('error code '+response.status,null)
        })
        .catch(error => {
          console.log(JSON.stringify(error))
          if(error&&error.response)
              callback(error.response.data,null)
              else callback({message:"connection error"},null)
      });
}



