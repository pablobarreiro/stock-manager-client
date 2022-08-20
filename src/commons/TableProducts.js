import useInput from "../hooks/useInput";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ProductContext } from "../contexts/productsContext";
import { ActualSaleContext } from "../contexts/actualSaleContext";
import swal from 'sweetalert';
import { prependBaseUri } from "../baseUri";

const TableProduct = ({ sale, edit, product }) => {
  const [quantity, setQuantity] = useState(1);
  const price = useInput(product.price);
  const name = useInput(product.name);
  const category = useInput(product.category);
  const stock = useInput(product.stock);
  const { setProducts } = useContext(ProductContext);
  const { actualSale, setActualSale } = useContext(ActualSaleContext)
  
  const handleAdd = () => {
    if (
      !quantity !== "" &&
      price.value !== "" &&
      quantity !== 0 &&
      !price.value !== 0 &&
      product.stock
    ) {
      setActualSale([
        ...actualSale,
        {
          ...product,
          quantity: Number(quantity),
          price: Number(price.value),
        },
      ]);
    }
  };

  useEffect(() => {
    axios
      .put(prependBaseUri(`/api/products/edit/${product.id}`), {
        name: name.value,
        category: category.value,
        stock: stock.value,
        price: product.price,
      })
      .then(() => axios.get(prependBaseUri("/api/products/all")))
      .then((res) => res.data)
      .then((prod) => setProducts(prod));
  }, [edit]);

  const handleQuantityChange = (e) => {
    if (e.target.value <= 0) setQuantity(Number(e.target.value));
    else if (e.target.value >= product.stock) setQuantity(product.stock);
    else setQuantity(e.target.value);
  };

  const handleDelete = (id) => {
    let saleArray = actualSale.filter((prod) => prod.id !== id);
    setActualSale(saleArray);
  };

  return (
    <tr>
      <td>{edit ? <Form.Control type="text" {...name} /> : product.name}</td>
      <td>
        {edit ? <Form.Control type="text" {...category} /> : product.category}
      </td>
      {!sale && (
        <td>
          {edit ? <Form.Control type="number" {...stock} /> : product.stock}
        </td>
      )}
      <td>
        {sale ? (
          product.quantity
        ) : (
          <Form.Control
            min="1"
            type="number"
            value={product.stock ? quantity : 0}
            onChange={handleQuantityChange}
          />
        )}
      </td>
      <td>
        {sale ? (
          `$ ${product.price}`
        ) : (
          <Form.Control min="0" type="number" {...price} />
        )}
      </td>
      {sale ? (
        <>
          <td>$ {product.price * product.quantity}</td>
          <td>
            <Button
              variant="outline-danger"
              onClick={() => handleDelete(product.id)}
            >
              Eliminar
            </Button>
          </td>
        </>
      ) : (
        <td>
          { !product.stock ? 
          <Button disabled='disabled' variant="outline-danger">
          Sin Stock
          </Button>
          : actualSale.find(sale=> sale.name === product.name) ? 
          <Button disabled='disabled' variant="outline-success">
            agregado
          </Button>
          :
          <Button variant="outline-success" onClick={handleAdd}>
            agregar
          </Button> }
        </td>
      )}
    </tr>
  );
};

export default TableProduct;
