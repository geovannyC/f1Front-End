export const MotorSearch2 = async(word, arr, paramS)=>{
    if(word && arr && paramS){
        const findByParam = async () => {
            return new Promise((resolve) => {
              const result = arr.find((element) => element[paramS] === word);
              resolve(result);
            });
          };
        const resultSearch = await findByParam()
        return resultSearch
    }
}