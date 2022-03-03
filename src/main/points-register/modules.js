import { handleChangeValueInput } from "../find-text/findText";
import { MotorSearch2 } from "../motor-search2.0/motorSearch";
import { getData } from "../../until/fetch";
const puntos = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
export const arrFinder = (data, text) => {
  let newArrTxt = text.splice(0, 10);
  return Promise.all(
    newArrTxt.map(async (element) => {
      if (typeof element === "string") {
        const elementsSplited = { ...element.split(" ") };
        const frstEl = elementsSplited[0];
        const secEl = elementsSplited[1];
        const findFirstEl = await handleChangeValueInput(frstEl, data);
        if (findFirstEl.length > 0) {
          return findFirstEl[0];
        } else if (secEl) {
          const findSecEl = await handleChangeValueInput(secEl, data);
          if (findSecEl[0]) {
            return findSecEl[0];
          } else {
            return newArrTxt.indexOf(element);
          }
        } else {
          const forcefindWord = data.find((resultFind) =>
            resultFind.includes(element.substring(2, element.length + 1))
          );
          if (forcefindWord) {
            return forcefindWord;
          } else {
            return newArrTxt.indexOf(element);
          }
        }
      } else {
        return element;
      }
    })
  );
};
export const fnArrComposed = (arrCompleted, arrIncompleted) => {
  return new Promise((resolve) => {
    function eachCompleted() {
      return arrCompleted.map((element) => {
        if (arrIncompleted[element]) {
          return arrIncompleted[element];
        } else {
          return element;
        }
      });
    }
    resolve(eachCompleted());
  });
};
export const formattoArrWords = (text) => {
  let words = text.split("\n");
  let newArr = [];

  words.map((element) => {
    let result = element.trimStart();
    if (result.length > 2) {
      let newElement = result
        .replace(/[^a-zA-Z ]/g, "")
        .toLowerCase()
        .trimEnd();
      newArr.push(newElement);
    }
  });
  return newArr;
};
export const findImage = (value) => {
  return new Promise(async (resolve) => {
    let image;
    const url = `/getImagesPilots/${value}`;
    await getData(url).then((response) => {
      if (response) {
        image = response;
      }
    });

    resolve(image);
  });
};
export const FinderByAliasName = (dataDrivers, dataScuderias, arr) => {
  return Promise.all(
    arr.map(async (element) => {
      if (typeof element === "string") {
        let name = await MotorSearch2(element, dataDrivers, "nombre", true);
        if (name) {
          let scuderia = await findScuderiaDriver(dataScuderias, name._id);
          let getImage = await findImage(name.carpetaPiloto);

          let i = arr.indexOf(element);
          let newArr = {};
          newArr.piloto = name._id;
          newArr.prev_driver = name;
          newArr.posicion = i;
          newArr.puntos = puntos[i];
          newArr.colors = scuderia.colors;
          newArr.image = getImage;
          newArr.sanciones = [];
          return newArr;
        } else {
          let alias = await MotorSearch2(element, dataDrivers, "alias", true);
          if (alias) {
            let scuderia = await findScuderiaDriver(dataScuderias, alias._id);
            let getImage = await findImage(alias.carpetaPiloto);
            let i2 = arr.indexOf(element);
            let newArr2 = {};
            newArr2.piloto = alias._id;
            newArr2.prev_driver = alias;
            newArr2.posicion = i2;
            newArr2.puntos = puntos[i2];
            newArr2.colors = scuderia.colors;
            newArr2.image = getImage;
            newArr2.sanciones = [];
            return newArr2;
          }
        }
      } else {
        return element;
      }
    })
  );
};
export const findScuderiaDriver = async (data, driver) => {
  const arrScuderias = data.map((result) => result.escuderia);
  let statusDriver1Scuderia = await MotorSearch2(
    driver,
    arrScuderias,
    "piloto1"
  );
  let statusDriver2Scuderia = await MotorSearch2(
    driver,
    arrScuderias,
    "piloto2"
  );
  const statusScuderia = statusDriver1Scuderia
    ? statusDriver1Scuderia
    : statusDriver2Scuderia;

  return statusScuderia;
};
export const buildSchemmaPointsDrivers = (arrDriver, arrPoints) => {
  return Promise.all(
    arrDriver.map(async (element) => {
      const getDataByIdDriver = await MotorSearch2(
        element.piloto._id,
        arrPoints,
        "piloto"
      );
      let newSchemma = {
        piloto: element.piloto._id,
        puntos: element.puntos,
        sanciones: element.sanciones,
        advertencias: element.advertencias,
      };
      if (getDataByIdDriver) {
        if (getDataByIdDriver.sanciones.length > 0) {
          var totalFaults = 0;
          var totalWarnings = 0;
          for (var i in getDataByIdDriver.sanciones) {
            let dataPoints = getDataByIdDriver.sanciones[i].puntos;
            let dataWarnings = getDataByIdDriver.sanciones[i].advertencia;
            typeof dataPoints === "number" && (totalFaults += dataPoints);
            typeof dataWarnings === "number" && (totalWarnings += dataWarnings);
          }
          newSchemma.puntos -= totalFaults;
          newSchemma.sanciones += totalFaults;
          newSchemma.advertencias += totalWarnings;
          if (newSchemma.advertencias >= 5) {
            let result = parseInt(newSchemma.advertencias / 3) * 5;
            newSchemma.puntos -= result;
          }
        }
        newSchemma.puntos += getDataByIdDriver.puntos;
      }
      return newSchemma;
    })
  );
};
export const buildSchemmaPointsScuderias = (arrScuderias, arrPointsDrivers) => {
  return Promise.all(
    arrScuderias.map(async (element) => {
      // console.log(arr)
      let newSchemma = { ...element };
      let getData1ByIdDriver = await MotorSearch2(
        element.escuderia.piloto1,
        arrPointsDrivers,
        "piloto"
      );
      let getData2ByIdDriver = await MotorSearch2(
        element.escuderia.piloto2,
        arrPointsDrivers,
        "piloto"
      );
      newSchemma.puntos +=
        getData1ByIdDriver.puntos + getData2ByIdDriver.puntos;
      newSchemma.sanciones +=
        getData1ByIdDriver.sanciones + getData2ByIdDriver.sanciones;
      newSchemma.advertencias +=
        getData1ByIdDriver.advertencias + getData2ByIdDriver.advertencias;
      newSchemma.escuderia = element.escuderia._id;
      return newSchemma;
    })
  );
};
// export const buildSchemmaTotalPointsDriver = async(arr, )=>
//   return new Promise((resolve, reject) => {

//       words.map((element) => {
//         if (element.lenght > 2) {
//           let newEl = element.replace(/[^a-zA-Z ]/g, "").toLowerCase();
//           newArr.push(newEl);
//         }
//       })
//     if(newArr.length>0){
//         resolve(newArr)
//     }else{
//         reject(false)
//     }
//   });
