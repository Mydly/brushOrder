
import CONSTS from '../config/consts';
import {showMsgAction} from './alert';

export const saveSettingAction = (opt)=>{
    return {
        type:CONSTS.action.saveAPISettings,
        data:opt
    }
}

export const saveApiSettings = (opt)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:CONSTS.action.saveAPISettings,
            data:opt
        });
        dispatch(showMsgAction("保存成功"));
    }
}