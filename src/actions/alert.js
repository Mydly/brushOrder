
import CONSTS from '../config/consts';

export const showMsgAction = (msg,level=1)=>{
    return {
        type:CONSTS.action.showMsg,
        data:{
            msg:msg,
            level:level
        }
    };
}

export const showMsg = (msg,level=1)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:CONSTS.action.showMsg,
            data:{
                msg:msg,
                level:level
            }
        });
    }
}

export const cancelMsg = ()=>{
    return (dispatch,getState)=>{
        dispatch({
            type:CONSTS.action.cancelMsg
        });
    }
}

export const showLoad = (timeout=5,msg="")=>{
    return (dispatch)=>{
        dispatch({
            type:CONSTS.action.showLoad,
            msg:msg
        })
        setTimeout(()=>{
            dispatch({
                type:CONSTS.action.removeLoad
            })
        },timeout*1000);
    }
}

export const removeLoadAction = ()=>{
    return {
        type:CONSTS.action.removeLoad
    }
}

export const removeLoad = ()=>{
    return (dispatch)=>{
        dispatch({
            type:CONSTS.action.removeLoad
        });
    }
}

