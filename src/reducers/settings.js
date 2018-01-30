
import CONSTS from '../config/consts'
import COMMON from '../function/common';

let initState = COMMON.settingGet(CONSTS.cacheName.apiSettings) || {} 

export default function (state = initState, action) {
    switch (action.type){
        case 'setting':
        {
            return Object.assign({}, state, {tabBar:action.item});
        }
        case CONSTS.action.saveAPISettings:
        {
            return Object.assign({},state,action.data);
        }
        default:
            return state;
    }
}
