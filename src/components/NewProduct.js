import axios from "axios";
import { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ProductContext } from "../contexts/productsContext";
import useInput from "../hooks/useInput";
import { prependBaseUri } from "../baseUri";

const NewProduct = ({ show, setShow }) => {
  const name = useInput("");
  const category = useInput("");
  const stock = useInput(0);
  const price = useInput(0);

  const { setProducts } = useContext(ProductContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(prependBaseUri("/api/products/add"), {
        name: name.value,
        category: category.value,
        stock: Number(stock.value),
        price: Number(price.value),
      })
      .then(() => {
        axios
          .get(prependBaseUri("/api/products/all"))
          .then((res) => res.data)
          .then((prod) => {
            setProducts(prod);
            setShow(false);
          });
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="addProductForm" onSubmit={handleSubmit} className="form">
          <label>Nombre: </label>
          <input {...name} />
          <label>Categoria: </label>
          <input {...category} />
          <label>Stock inicial: </label>
          <input type="number" {...stock} />
          <label>Precio: </label>
          <input type="number" {...price} />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button variant='primary' form="addProductForm">Agregar</button>
        <Button variant='secondary' onClick={() => setShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewProduct;
