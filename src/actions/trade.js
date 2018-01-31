
import CONSTS from '../config/consts';
import myCheck from 'mydly-check';
import {removeLoadAction} from './alert';
import COMMON from '../function/common';

export const showMsgAction = (msg,level=1)=>{
    return {
        type:CONSTS.action.showMsg,
        data:{
            msg:msg,
            level:level
        }
    };
}

export const getMarket = (tradeApi)=>{
    return (dispatch,getState)=>{
        tradeApi._getAllMarket((res)=>{

            dispatch({
                type:CONSTS.api.requestAllMarket,
                data:res
            });
            
        },0,requestFail(dispatch));
    }
}

export const cancelMsg = ()=>{
    return (dispatch,getState)=>{
        dispatch({
            type:CONSTS.action.cancelMsg
        });
    }
}

export const receiveRespond = (dispatch)=>{
    return ()=>{
        dispatch(removeLoadAction());
   }
}

export const requestFail = (dispatch, level = 'warning')=>{
   return ()=>{
        dispatch(showMsgAction('请求失败,请检查设置或网络',level));
   }
}

export const getBalance = (tradeApi) =>{
    return (dispatch)=>{
        tradeApi._getBalance( (res)=>{
            dispatch({
                type:CONSTS.api.requestBalance,
                data:res
            })
        },0,requestFail(dispatch));
    }
}

export const sendTran = (tradeApi,option,callback) => {
    return (dispatch) => {
        tradeApi._tranOrder( option, (res) => {
            if(res.err){
                dispatch(showMsgAction(res.err,'warning'));
                dispatch(addLogAction( Object.assign(option,{
                    action:"trade",
                    time:COMMON.getDateTime(),status:-1,err:res.err}) ));
            }else{
                dispatch(addLogAction( Object.assign(option,{
                    action:"trade",
                    time:COMMON.getDateTime(),status:0
                }) ));
                callback && callback(option);
            }
        },receiveRespond(dispatch),requestFail(dispatch));
    }
}

export const addLogAction = (option)=>{
    return {
        type:CONSTS.action.addLog,
        data:option
    }
}

export const getGuadanList = (tradeApi, option, callback) => {
    return (dispatch) => {
        tradeApi._getGuadanList( option, (res) => {
            if(res.err){
                dispatch(showMsgAction("查询挂单失败"+res.err,'warning'));
                dispatch(addLogAction( Object.assign(option,{
                    action:"guadan",
                    time:COMMON.getDateTime(),status:-1,err:res.err}) ));
            }else{
                dispatch(addLogAction( Object.assign(option,{
                    action:"guadan",
                    time:COMMON.getDateTime(),status:0
                }) ));
                callback && callback(res);
            }
        }, 0, requestFail(dispatch));
    }
}

export const cancelOrder = (tradeApi, option, callback) => {
    return (dispatch) => {
        tradeApi._cancelGuadan( option, (res) => {
            if(res.err){
                dispatch(showMsgAction("撤销挂单出错,"+res.err,'warning'));
                dispatch(addLogAction( Object.assign(option,{
                    action:"cancel_guadan",
                    time:COMMON.getDateTime(),status:-1,err:res.err}) ));
            }else{
                dispatch(addLogAction( Object.assign(option,{
                    action:"cancel_guadan",
                    time:COMMON.getDateTime(),status:0
                }) ));
                 
            }
        }, 0, requestFail(dispatch));
    }
}

export const getTradeLog = (tradeApi, option, call) => {
    return (dispatch) => {
        tradeApi._getTradeLog(option, (res)=> {
            if(res.err){
                dispatch(showMsgAction("获取交易记录失败,"+res.err,'warning'));
            }else{
                dispatch({
                    type:CONSTS.api.requestTradeLog,
                    data:res.succ
                });
                 
            }
        }, 0 , requestFail(dispatch));
    }
}
