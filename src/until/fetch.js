export const getData=async(url)=>{

    const dirSolve =  `https://composite-watch-335623.an.r.appspot.com${url}`
      const response = await fetch(dirSolve, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Autorizations': localStorage.getItem('token'),
        }   
    }); 
    
    
    if (response.status===200){
      const json = await response.json()
      return json
    }else { 
      
      return false
      }
   
  }
  export const sendData=async(data,url)=>{
    const dirSolve = `https://composite-watch-335623.an.r.appspot.com${url}`
      const response = await fetch(dirSolve, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Autorizations': localStorage.getItem('token'),
        }   
    });
    
    if (response.status===(200)){
      const json = await response.json()
      return json
    }else { 
      
      return false
      }
    }