const Config = require('../config/config');
const crypto = require('crypto');
const settings = require('electron-settings');
const CONSTS = require('../config/consts');
const Lang =  require('../config/lang');
const assert = require('assert');
const check = require('mydly-check');

const COMMON = {
    mem:mem,
    alog:alog,
    isArray:isArray,
    isJson:isJson,
    isJsonOfString:isJsonOfString,
    makeWords:makeWords,
    isString:isString,
    encode:encodeData,
    decode:decodeData,
    settingSet:settingSet,
    settingGet:settingGet,
    settingHas:settingHas,
    getLang:getLang,
    setLang:setLang,
    getCoinName:getCoinName,
    setCoinName:setCoinName,
    getToken:getToken,
    getPassword:getPassword,
    getPublicKey:getPublicKey,
    getPrivateKey:getPrivateKey,
    getSecret:getSecret,
    clearStore:clearStore,
    showLang:showLang,
    getDateTime:getDateTime
}

function mem() {
    var key   = arguments[0] ? arguments[0] : '';
    var value = arguments[1];
    //如果键为空,退出
    if (!key) {
        alog('[缓存],key不存在异常');
        return;
    }

    //如果传入的值为null,那么清除缓存
    if (value === null) {
        alog('[缓存],清除缓存,key=' + key);
        return localStorage.removeItem(key);
    }
    //如果传入了值,那么写入缓存
    if (key && value) {
        alog('[缓存],写入缓存,key=' + key + '|value=' + value);
        isString(value) || ( value = JSON.stringify(value) );
        return localStorage.setItem(key, value);
    }
    //如果没有传入值,那么获取缓存
    if (key && !value) {
        var res = localStorage.getItem(key);
        if( !isString(res) ) {
            res = JSON.parse(res) ;
        }
        alog('[缓存],获取缓存,key=' + key + '|value=' + JSON.stringify(res));
        return res;
    }
}

 function alog (log, type) {
     if(!log) return;
    console.log(log);
}

/*
 ***************    类型判断    **************
 */
function isArray (object){ return object && typeof object==='object' && Array === object.constructor }

function isString (object){ return object && typeof object==='string' && String === object.constructor }

function isFunction (obj){ return obj && typeof obj === 'function' && Function === obj.constructor}

function isInt (obj){ return obj && typeof obj === 'number' && parseInt(obj) == obj}

function isNumberOfSting(obj){ return isString(obj) && !isNaN(obj) }

function isJson(obj){
    var isjson = typeof(obj) == "object" &&
     Object.prototype.toString.call(obj).toLowerCase() == "[object object]" &&
      !obj.length;   
    return isjson; 
}

function isJsonOfString(obj) {
    if( !isString(obj) ){
        return false;
    }

    try {
        JSON.parse(obj);
        return true;
    } catch(e) {
        return false;
    } 
}

function array_all_are_string(obj){
    if(!isArray(obj)) return false;
    for (var item in obj){
        if(!isString(item))return false;
    }
    return true;
}

function isMobile (obj){ return isString(obj) && /^\d{11}$/.test(obj) }
function isPassword (obj){ return isString(obj) && /^\S{6,20}$/.test(obj) }

function isArrayIncludeElement( arr , ele){
    if( !arr || !ele || !isArray(arr) ){
        return false;
    }
    
    for(var aa in arr){
        if( aa.toString() == ele.toString() ){
            return true;
        }
    }
    return false;

}

/**
 * 生成 18个不重复的 单词
 * @param {*} source 
 * @param {*} length 
 * @param {*} repeat 
 */

function makeWords ( source, length, repeat = false ) {
    if( !array_all_are_string(source) ){
        return null;
    }
    if( !isInt(length) || length < 1){
        return null;
    }

    var wordsArray = makeArray(18);
    var words = '';
    for (var index = 0; index < wordsArray.length; index++ ){
        let key = wordsArray[index];
        words += source[key];
        if(index != wordsArray.length - 1){
            words += " "; 
        }
    }

    return words;

}

function makeInt ( min,max ) {
    let num = Math.floor( Math.random()*1000000 );
    return (num%(max-min))+min;
}

function makeArray( length, repeat = false){
    if( !isInt(length) || length < 1  ){
        return null;
    }
    let numArray = [];
    while( numArray.length < length ){
        let num = makeInt(0,1024);
        if( !isArrayIncludeElement(numArray, num) ){
            numArray.push(num);
        } 
    }
    return numArray;
}

//===========   end   ===========//


/**
 * 加密 解密
 * @param {*} data 
 */
function encodeData(data){

    
    const cipher = crypto.createCipher('aes192', Config.safePwd);
    
    let enword = cipher.update(data,'utf8','hex');
    enword += cipher.final('hex');
    return enword;
}

function decodeData(data){

    const decipher = crypto.createDecipher('aes192', Config.safePwd);
    
    let deword = decipher.update(data,'hex','utf8');
    deword += decipher.final('utf8');
    return deword;
}

/**
 * 缓存
 * @param {*} key 
 * @param {*} value 
 */

function settingSet(key,value){

    settings.set(
        encodeData(key),
        encodeData( isString(value) ? value : JSON.stringify(value) )
    );
}

function settingGet(key){
    let value = settings.get( encodeData(key) );
    value = value ? decodeData(value) : null;
    return check.isStringOfJson(value) ? JSON.parse(value) : value;
}

function settingHas(key){
    return settings.has( encodeData(key) );
}


/**
 * time & date
 */
function getDateTime(){
    let now = new Date();
    return now.toLocaleDateString()+" "+now.toLocaleTimeString();
}

/**
 * app 应用方法
 */

function clearStore(){
    settings.deleteAll();
}

function getSecret(){
    let secret = settingGet(CONSTS.cacheName.secret);
    let secretObj = JSON.parse(secret);
    return secretObj || null;
}

function getPassword(){
    let secret = settingGet(CONSTS.cacheName.secret);
    let secretObj = JSON.parse(secret);
    if(!secretObj) return null;
    return secretObj.password || null;
}

function getPublicKey(){
    let secret = settingGet(CONSTS.cacheName.secret);
    let secretObj = JSON.parse(secret);
    if(!secretObj) return null;
    return secretObj.publicKey || null;
}

function getPrivateKey(){
    let secret = settingGet(CONSTS.cacheName.secret);
    let secretObj = JSON.parse(secret);
    if(!secretObj) return null;
    return secret.privateKey || null;
}

function getLang(){
    let lang = settingGet(CONSTS.cacheName.lang) || 'en';
    return lang;
}

function getCoinName(){
    let coinName = settingGet(CONSTS.cacheName.coinName) || Config.defaultCoin || 'BTC';
    return coinName;
}

function getToken(){
    let token = COMMON.settingGet(CONSTS.cacheName.token) || null;
    return token;
}

function setLang(lang){
    settingSet(CONSTS.cacheName.lang,lang);
}

function setCoinName(coinName){
    settingSet(CONSTS.cacheName.coinName,coinName);
}

function showLang(path, lang, remarks){
    let obj = Lang[path];
    assert.notEqual(obj,0,'function showLang param path is error:path='+path);
    let text = obj[lang];
    assert.notEqual(text,0,'function showLang param lang is error:lang='+lang);
    return text;

}

module.exports = COMMON;