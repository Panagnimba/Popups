
export const state = () =>({
    auth:{
        _id:"",
        username:"",
        token:null
    },
    currentPopup:{
        _id:"",
        componentName:"",
        config:{
            img:"",
            description:"",
            showPopup:true,
            showEmail:true,
            showName:true,
            showPhone:true,

            tr:"",
            tl:"",
            br:"",
            bl:"",
            ctr:"",

            timeout:"",
            submitText:""
        }
    },
    notifications:[],
    fullSendPopup:{
        active:false,
        email:[],
    },
    default:{
        active:false,
        object:"",
        content:""
    }
  });

export const mutations={
    setAuthUser(state,payload){
        state.auth=payload;
    },
    setCurrentPopup(state,payload){
        state.currentPopup = payload
    },
 
    setCurrentPopupImage(state,image){
        state.currentPopup.config.img = image
    },
    addNotification(state,notif){
        state.notifications.push({id:Date.now(),...notif})
    },
    deleteNotification(state,notif){
        state.notifications = state.notifications.filter(item => item.id != notif.id)
    },
    setFullSendPopup(state,payload){
        state.fullSendPopup = payload;
    },
    setDefault(state,payload){
        state.default = payload;
    }
}


export const actions={
    setCurrentPopup({commit},payload){
        commit("setCurrentPopup",payload)
    },
    addNotification({commit},notif){
        commit("addNotification",notif)
    },
    deleteNotification({commit},notif){
        commit("deleteNotification",notif)
    },
    setFullSendPopup({commit},payload){
        commit('setFullSendPopup',payload)
    },
    setDefault({commit},payload){
        commit('setDefault',payload)
    }
}
export const getters={
    getToken(state){
        return state.auth.token;
    }
}
