import { render, screen } from "@testing-library/react";
import App from "./App";
import { choseRandomItem } from "./main/chose-random-Intem/choseRandomItem";
import { arrFinder, formattoArrWords, buildSchemmaPointsScuderias,fnArrComposed, FinderByAliasName, buildSchemmaPointsDrivers } from "./main/points-register/modules";
import { handleChangeValueInput } from "./main/find-text/findText";
import { driversTest1,expectedTest1,exampleTest1, scuderiaTest,dataToFindDrivers,dataToInjectArrFinder,  expectedTest2, scuderiaTest2  } from "./test";
import { getData } from "./until/fetch";
test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
test("choose random item from array", async () => {
  const arr = [1, 2, 3, 4, 5];
  const exec = await choseRandomItem(arr);
  expect(exec).toBeTruthy();
});
describe("Testing Modules", () => {
  test("should to formated word in a text", async () => {
    let text = `
    SERGIO PEREZ
    DANIEL RICCIARDO
    E.GUTIERREZ
    
    NICO HULKEN
    PAUL DI RESTA
    JEAN-ERIC VER
    ADRIAN SUTIL
    MARK WEBBER
    VALTTERI BOTTAS /
    FELIPE MASSA
    ROMAIN GROSJEAN`;
    let expected = [
      "sergio perez",
      "daniel ricciardo",
      "egutierrez",
      "nico hulken",
      "paul di resta",
      "jeaneric ver",
      "adrian sutil",
      "mark webber",
      "valtteri bottas",
      "felipe massa",
      "romain grosjean",
    ];
    const fnFormat = formattoArrWords(text);
    expect(fnFormat).toStrictEqual(expected);
  });
  test('should to print hulkengberg', async() => {
    let arrDrivers = [
      "vettel",
      "charles pic",
      "maldonado",
      "sutil",
      "grossjean",
      "gutierrez",
      "bianchi",
      "raikkonen",
      "button",
      "massa",
      "alonso",
      "hulkengberg",
      "webber",
      "ricciardo",
      "hamilton",
      "bottas",
      "di resta",
      "perez",
      "chilton",
      "vernie",
    ];
    const txttest= "hulk"
    const expected2 = ["hulkengberg"]
    const fnWord = await handleChangeValueInput(txttest,arrDrivers)
    expect(fnWord).toStrictEqual(expected2);
  });
  test("should to print the same array", async () => {
    let arrDriversToSearch = [
      "sergio perez",
      "daniel ricciardo",
      "egutierrez",
      "nico hulken",
      "paul di resta",
      "asdfasdf",
      "adrian sutil",
      "mark webber",
      "valtteri bottas",
      "felipe massa",
      "romain grosjean",
    ];
    let expected = [
      "perez",
      "ricciardo",
      "gutierrez",
      "hulkengberg",
      "di resta",
      5,
      "sutil",
      "webber",
      "bottas",
      "massa"
    ];
    let arrDrivers = [
      "vettel",
      "charles pic",
      "maldonado",
      "sutil",
      "grossjean",
      "gutierrez",
      "bianchi",
      "raikkonen",
      "button",
      "massa",
      "alonso",
      "hulkengberg",
      "webber",
      "ricciardo",
      "hamilton",
      "bottas",
      "di resta",
      "perez",
      "chilton",
      "vernie",
    ];
    // const fnArrFinded = await arrFinder(
    //   arrDrivers,
    //   arrDriversToSearch
    // );
      // expect(fnArrFinded).toStrictEqual(expected)
  });
  test('should to get data drivers drom alias or name', async() => {
    const urlgetAllDrivers = "/find-driver";
    let urlgetFindCh = `/find-by-id-championship?id=621529696fd2d43ec487c740`;
    // let dataCH =await getData(urlgetFindCh)
    // let dataDrivers = await getData(urlgetAllDrivers)
    let arr = [
      "perez",
      "ricciardo",
      "gutierrez",
      "hulkengberg",
      "di resta",
      5,
      "sutil",
      "webber",
      "bottas",
      "massa"
    ];
    // const fnFinderByAliasName = await FinderByAliasName(dataDrivers,dataCH.escuderias, arr)
    // expect(fnFinderByAliasName).toHaveLength(10)
  });
  test('should to print each arr with the name and the rest with a number', async() => {
    const arr = [0,1,2,3,4,5,6,7,8,9]
    const testArrNames = ["teste1", "teste2"]
    const expected =  [ 'teste1', 'teste2', 2, 3, 4, 5, 6, 7, 8, 9 ]
    const fnFnArrComposed = await fnArrComposed(arr, testArrNames)
    expect(fnFnArrComposed).toStrictEqual(expected)
  });
  test('should to print arr without undefined elements', async() => {
    const fnArrFinder = await arrFinder(dataToFindDrivers, dataToInjectArrFinder)
    console.log(fnArrFinder)
  });
});
describe("testing Fetch Module",()=>{
  test('should to print the schemma for total points drivers and scuderia', async() => {

    // const fnBuildSchemmaPointsDrivers = await buildSchemmaPointsDrivers(driversTest1.pilotos,exampleTest1.data.info)
    // console.log(fnBuildSchemmaPointsDrivers)
    // const fnbuildSchemmaPointsScuderias = await buildSchemmaPointsScuderias(scuderiaTest2.escuderias,fnBuildSchemmaPointsDrivers)
    
    // expect(fnBuildSchemmaPointsDrivers).toStrictEqual(expectedTest1)
    // expect(fnbuildSchemmaPointsScuderias).toHaveLength(10)
  });
})
