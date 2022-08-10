import axios from "axios";
import { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { ProductContext } from "../contexts/productsContext";
import useInput from "../hooks/useInput";

const NewProduct = ({ show, setShow }) => {
  const name = useInput("");
  const category = useInput("");
  const stock = useInput(0);
  const price = useInput(0);

  const { setProducts } = useContext(ProductContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/products/add", {
        name: name.value,
        category: category.value,
        stock: Number(stock.value),
        price: Number(price.value),
      })
      .then(() => {
        axios
          .get("/api/products/all")
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
        <button form="addProductForm">Agregar</button>
        <button onClick={() => setShow(false)}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewProduct;
