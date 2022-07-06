export default function ({ $axios, redirect }) {
  
  $axios.defaults.withCredentials = true  //include credentials for every request

  $axios.onError(error => {
    //   const code = parseInt(error.response && error.response.status)
      {
        redirect('/error')
      }
    })
  }