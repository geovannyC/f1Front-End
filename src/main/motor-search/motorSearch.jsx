import { handleChangeValueInput } from "../find-text/findText";

export const handleReduceSearch = async (txt, data, dataAlias, drivers) => {
  if (txt && data && dataAlias) {
    const findByNameDriver = async (driver) => {
        
      return new Promise((resolve) => {
        const result = drivers.find((element) => element.nombre === driver[0]);
        resolve(result);
      });
    };
    const findByAliasDriver = async (driver) => {
      return new Promise((resolve) => {
        const result = drivers.find((element) => element.alias === driver[0]);
        resolve(result);
      });
    };
    return new Promise(async (resolve) => {
      let result;
      await handleChangeValueInput(txt, data).then(async (driverFinded) => {
          if (driverFinded && driverFinded.length > 0) {
              if (driverFinded.length === 1 && driverFinded !== "false") {
                  
                  await findByNameDriver(driverFinded).then(async (result2) => {
              result = result2;
            });
          } else {
            result = false;
          }
        } else {
          await handleChangeValueInput(txt, dataAlias).then(
            async (driverFinded2) => {
              if (driverFinded2 && driverFinded2.length > 0) {
                if (driverFinded2.length === 1 && driverFinded2 !== "false") {
                  await findByAliasDriver(driverFinded2).then(
                    async (result2) => {
                      result = result2;
                    }
                  );
                } else {
                  result = false;
                }
              } else {
                result = false;
              }
            }
          );
        }
      });
      resolve(result);
    });
  }
};
