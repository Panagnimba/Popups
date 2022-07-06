
export const state = () =>({
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
    auth:{
        _id:"",
        username:"",
        token:null
    },

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
    }
}


export const actions={
    setCurrentPopup({commit},payload){
        commit("setCurrentPopup",payload)
    }
}
export const getters={
    getToken(state){
        return state.auth.token;
    }
}
