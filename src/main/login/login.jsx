import React, {
  useState,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import { getData, sendData } from "../../until/fetch";
export const Login = () => {
  const [image, setImage] = useState(false),
    [ondaWord, setOndaWord] = useState(false),
    [errorLogin, setErrorLogin] = useState(false);
  useEffect(() => {
    getRandomImage();
    getRandomOndaWord();
    // eslint-disable-next-line
  }, [!image, !ondaWord]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const getRandomOndaWord = async () => {
    const url = "/get-random-ondaword";
    await getData(url).then((result) => {
      if (result) {
        setOndaWord(result);
      }
    });
  };

  const findImage = (value) => {
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
  const filterFolders = (arr) => {
    return new Promise(async (resolve) => {
      let filter = arr.filter((item) => {
        if (item.includes("f1")) {
          return item;
        }else{
          return false
        }
        // item.includes("f1") === true ? item : null;
      });
      resolve(filter);
    });
  };
  const onSubmit = async (data) => {
    const url = "/check-onda-word";
    let dataToFetch = {
      id: ondaWord._id,
      onda: data.onda,
    };
    await sendData(JSON.stringify(dataToFetch), url).then((response) => {
      console.log(response)
      if (response) {
        localStorage.setItem("id", response.id);
        localStorage.setItem("token", String(response.token));
        window.location.reload()
      } else {
        setErrorLogin(true);
      }
    });
  };
  const getRandomImage = async () => {
    if (!image) {
      const url = "/find-folders";
      await getData(url).then(async (response) => {
        if (response) {
          await filterFolders(response).then(async (response2) => {
            if (response2) {
              const getRandomResult =
                response2[Math.floor(Math.random() * response2.length)];
              console.log(getRandomResult);
              await findImage(getRandomResult).then((response3) => {
                if (response3) {
                  setImage(response3);
                }else{
                  return false
                }
              });
            } else {
              return false;
            }
          });
        }else{
          return false
        }
      });
    }else{
      return false
    }
  };

  const SchemmaLogin = () => {
    return (
      <div className="general-container black-color">
        <div className="container-absolute black-curtain-circle-degradate"></div>
        <div className="container-back-content  index--2">
          <div className="container-image-login">
            <img className="image-logo" src={image ? image : false} alt="" />
          </div>
        </div>
        <div className="container-r-drivers ">
          {ondaWord ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="column1-schemma grid-three-columns-33-100">
                <small className="drivers-finded">
                  {ondaWord ? ondaWord.word : "Sin palabras"}
                </small>
                <input
                  className="input-autocomplete"
                  {...register("onda", { required: true, maxLength: 20 })}
                />
                {errors.onda && (
                  <small className="color-white">Éste es requerido</small>
                )}
                <div>
                  <input type="submit" onClick={handleSubmit(onSubmit)} />
                  {errorLogin ? (
                    <small className="color-white time">
                      El ondo no es correcto
                    </small>
                  ) : null}
                </div>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    );
  };
  return SchemmaLogin();
};
