export const getTxt = async (data) => {
  const arrDrivers = data.data.info;
  const driversMaped = await mapEachDriver(arrDrivers);
  return driversMaped;
};
export const mapEachDriver = (data) => {
  data.forEach((element) => {
    console.log(element.prev_driver.nombre);
    return element.prev_driver.nombre;
  });
};
