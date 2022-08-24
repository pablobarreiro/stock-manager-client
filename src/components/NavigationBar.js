import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import NewProduct from "./NewProduct";
import swal from "sweetalert";

import Button from "react-bootstrap/Button";
import { prependBaseUri } from "../baseUri";

const NavigationBar = ({ edit, handleEdit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const { user, toggleAuth, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(prependBaseUri("/api/user/me"))
      .then((res) => res.data)
      .then((loggedUser) => {
        toggleAuth(loggedUser);
        navigate("/home");
      });
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.post(prependBaseUri("/api/user/logout"));
      toggleAuth(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoadDB = () => {

  }

  const handleClearDB = () => {
    swal({
      title: "Eliminar Base de datos",
      icon: "warning",
      text: "Estas seguro que queres eliminar la lista de productos? Una vez confirmado no hay vuelta atras",
      buttons: ["NO!", "Si, eliminar"],
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(prependBaseUri('/api/products/db'))
        .then(()=>{
          swal("Se elimino la base de datos de productos correctamente", {
            icon: "success",
          });
        })
      }
    });
  };

  if (!isAuthenticated) return <></>;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1%",
        }}
      >
        <div>
          <Button
            variant="danger"
            style={{ marginRight: "10px" }}
            onClick={handleLogOut}
          >
            Log out
          </Button>
          <Button
            variant="outline-primary"
            style={{ marginRight: "10px" }}
            onClick={() => setShow(true)}
          >
            Agregar Producto
          </Button>
          {location.pathname === "/home" &&
            (edit ? (
              <Button
                variant="primary"
                style={{ marginRight: "10px" }}
                onClick={handleEdit}
              >
                Confirmar edicion
              </Button>
            ) : (
              <Button
                variant="outline-primary"
                style={{ marginRight: "10px" }}
                onClick={handleEdit}
              >
                Editar
              </Button>
            ))}
          {location.pathname === "/history" ? (
            <Button variant="outline-primary" onClick={() => navigate("/home")}>
              Volver
            </Button>
          ) : (
            <Button
              variant="outline-primary"
              onClick={() => navigate("/history")}
            >
              Historial
            </Button>
          )}
          <Button
            variant="outline-primary"
            style={{ marginLeft: "10px" }}
            onClick={handleLoadDB}
          >
            Cargar DB
          </Button>
          <Button
            variant="danger"
            style={{ marginLeft: "10px" }}
            onClick={handleClearDB}
          >
            Eliminar DB
          </Button>
        </div>
        {user && (
          <h1 style={{ textTransform: "capitalize" }}>{user.username}</h1>
        )}
      </div>
      <NewProduct show={show} setShow={setShow} />
    </>
  );
};

export default NavigationBar;
