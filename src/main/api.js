import request from 'mydly-request';
import crypto from 'crypto';
import querystring from 'querystring';
import myCheck from 'mydly-check';

import COMMON from '../function/common';


export default class {
  
  constructor( host,userid,key,secret) {
    this._host = host.indexOf('http') == 0 ? host : 'http://' + host;
    this._userid = userid;
    this._key = key;
    this._secret = secret;

  }

  _getAllMarket(callback,recRespond,retFail){
    let opt = {
        url:this._host+this._makeApi('all')
    } 

    this._sendReq(opt,callback,recRespond,retFail);
  }

  _getMarketOf(market,callback){
    let opt = {
        url:this._host+this._makeApi('ticker'),
        data:{
            market:market
        }
    } 
    this._sendReq(opt,callback);
  }

  _getBalance(callback,recRespond,retFail){
      let nonce = this._nonce();
      let sign = this._sign(nonce);
      let opt = {
          url:this._host+this._makeApi('balance'),
          method:'post',
          data:{
              key:this._key,
              nonce:nonce,
              signature:sign
          }
      }
      this._sendReq(opt,callback,recRespond,retFail);
  }

  _tranOrder(option,callback,recRespond,retFail){
    let nonce = this._nonce();
    let sign = this._sign(nonce);
    let opt = {
        url:this._host+this._makeApi('submit_order'),
        method:'post',
        data:Object.assign({},{
            key:this._key,
            nonce:nonce,
            signature:sign
        },option)
    }
    this._sendReq(opt,callback,recRespond,retFail);
  }

  _getGuadanList(option,callback,recRespond,retFail){
    let nonce = this._nonce();
    let sign = this._sign(nonce);
    let opt = {
        url:this._host+this._makeApi('list_order'),
        method:'post',
        data:Object.assign({},{
            key:this._key,
            nonce:nonce,
            signature:sign
        },option)
    }
    this._sendReq(opt,callback,recRespond,retFail);
  }

  _cancelGuadan(option,callback,recRespond,retFail){
      let nonce = this._nonce();
      let sign = this._sign(nonce);
      let opt = {
          url:this._host+this._makeApi('cancel_order'),
          method:'post',
          data:Object.assign({},{
              key:this._key,
              nonce:nonce,
              signature:sign
          },option)
      }
      this._sendReq(opt,callback,recRespond,retFail);
  }

  _makeApi(name){
      return '/api/trade/'+name;
  }

  _nonce(){
    let date = new Date().getTime();
    return parseInt( date / 1000);
  }

  _sign(nonce) {
    
    if( !this._userid || !this._key || !this._secret ){
        return null;
    }
    // key&用户ID&nonce&secret_key
    let sign = this._key+'&'+this._userid+'&'+nonce+'&'+this._secret;
    var md5 = crypto.createHash("md5").update(sign).digest('hex');
    return md5;
    
  }


  _sendReq(opt, callback, recRespond, retFail){
      request.send(opt,(err, res, body)=>{
          recRespond && recRespond();
          if(err){
             preDeal && preDeal();
             return;
          }
          if(myCheck.isStringOfJson(body)){
            //   COMMON.alog(body);
              callback && callback(JSON.parse(body));
          }else{
              preDeal && preDeal();
          }

      });
  }

}
