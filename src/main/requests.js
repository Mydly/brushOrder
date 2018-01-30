
const crypto = require('crypto'); 

import myReq from 'mydly-request';

/*
  @param
  url,
  method,
  datas,
  callBack,
*/
exports.send = (options,callBack) => {

    let {url,
        method="GET",
        data,
        header={},
        isCurl=false,
    } = options;

   var params2 = {
       url:url,
       method:method,
       data:data,
       header:header,
       isCurl:isCurl
   }

   myReq.send(params2,function (err,res,body){
    if(err) throw err;
    callBack && callBack( body );
});
   
}

const getNonce = function (){
    let date = new Date().getTime();
    date = parseInt( date / 1000);
    return date;
}


const checkRsaKeys = function (host,id,publicKey,privateKey){

    host = host.indexOf('http') == 0 ? host : 'http://'+host;

    host += '/api/trade/balance';
    let nonce = getNonce();
    let sign = signature(id,publicKey,privateKey,nonce);
    if(!sign) return '生成signature错误';
    let param = {
        method:"POST",
        url:host,
        data:{
        key:publicKey,
        nonce:nonce,
        signature:sign
        }
    }
    myReq.send(param,function(err,res,body){
        console.log(err);
        console.log(body);
    })
}
exports.checkRsaKeys = checkRsaKeys;

const signature = function(id,publicKey,privateKey,nonce){
    if( !id || !publicKey || !privateKey || !nonce ){
        return null;
    }
     
    var md5=crypto.createHash("md5");
    // key&用户ID&nonce&secret_key
    let sign = publicKey+'&'+id+'&'+nonce+'&'+privateKey;

    md5.update(sign);  
    var res = md5.digest('hex');  
    return res; 
    
}

