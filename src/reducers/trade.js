
const Consts = require('../config/consts');
const COMMON = require('../function/common');

let initState = {
    selectMarket:COMMON.settingGet(Consts.cacheName.selectMarket)
}

export default function trade(state = initState, action) {
    switch (action.type){
        case Consts.api.requestBalance:
        {
            return Object.assign({}, state, {
                balanceList:action.data.succ||null
            });
        }
        case Consts.api.requestAllMarket:
            return Object.assign({}, state,{
                market:action.data
            });
        case Consts.action.addLog:
            let logData = state.logData || [];
            if(logData.length > 1000){
                logData.splice(0,600);
            }
            logData.push(action.data);
            return Object.assign({}, state, {logData:logData});
        case Consts.api.requestTradeLog:
            return Object.assign({}, state, {
                tradeLog:action.data
            });
        default:
            return state;
    }
}