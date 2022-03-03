export const choseRandomItem = (array)=>{
    return new Promise ((resolve, reject)=>{
        if(array&&array.length>1){
            resolve(array[Math.floor(Math.random()*array.length)])
        }else{
            reject(false)
        }
    })

}