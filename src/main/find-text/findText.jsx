
const formatWords = (text) => {
    return new Promise((resolve) => {
      resolve(text.replace(/[^a-zA-Z ]/g, "").toLowerCase());
    });
  };
const filterItems = (needle, heystack) => {
    if (needle!==undefined && heystack!==undefined) {
      return new Promise((resolve) => {
        let query = needle.toLowerCase();
        let result = heystack.filter(
          (item) => item.toLowerCase().indexOf(query) >= 0
        );
        resolve(result);
      });
    }
  };
  const handleChangeValueInput = async (text, arr) => {
    if(text){
      let textFormat = await formatWords(text);
      let searchPilot = await filterItems(textFormat, arr);
      return searchPilot
    }else{
      return false
    }
  };
module.exports= {
    handleChangeValueInput
}