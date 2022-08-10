import axios from "axios";
import { useContext, useEffect, useState } from "react";
import TableProduct from "../commons/TableProducts";
import { AuthContext } from "../contexts/authContext";
import { ProductContext } from "../contexts/productsContext";
import useInput from "../hooks/useInput";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const Home = ({ edit }) => {
  const navigate = useNavigate();
  const [actualSale, setActualSale] = useState([]);
  const search = useInput();
  const { products, setProducts } = useContext(ProductContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const total = actualSale.reduce((pv, cv) => cv.price * cv.quantity + pv, 0);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    axios
      .get("/api/products/all")
      .then((res) => res.data)
      .then((prods) => {
        setProducts(prods);
      });
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    if (search.value.length >= 2) {
      const newProductList = [];
      products.forEach((product) =>
        product.name.toLowerCase().includes(search.value.toLowerCase()) ||
        product.category.toLowerCase().includes(search.value.toLowerCase())
          ? newProductList.push(product)
          : null
      );
      setFilteredProducts(newProductList);
    } else setFilteredProducts(products);
  }, [search.value]);

  const handleConfirmSale = () => {
    axios
      .post("/api/sales/confirm", actualSale)
      .then(() => {
        actualSale.forEach((product) => {
          product.stock = product.stock - product.quantity;
          return axios.put(`/api/products/edit/${product.id}`, product);
        });
      })
      .then(() => axios.get("/api/products/all"))
      .then((res) => res.data)
      .then((newProductList) => {
        setProducts(newProductList);
        setActualSale([]);
      })
      .catch((err) => console.log(err));
  };

  if (!isAuthenticated) return <></>;

  return (
    <>
      <Table size="sm" striped bordered>
        {actualSale[0] && (
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoria</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
              <th />
            </tr>
          </thead>
        )}
        <tbody>
          {actualSale.map((product, i) => (
            <TableProduct
              sale={true}
              product={product}
              actualSale={actualSale}
              setActualSale={setActualSale}
              key={i}
            />
          ))}
        </tbody>
        {actualSale[0] && (
          <tfoot>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td>Total: $ {total}</td>
            </tr>
          </tfoot>
        )}
      </Table>
      {actualSale[0] && (
        <Button variant="outline-success" onClick={handleConfirmSale}>
          Finalizar venta
        </Button>
      )}
      <div style={{ marginBottom: "3%" }}></div>

      <label>Buscar por nombre o categoria: </label>
      <Form.Control {...search} />

      <Table size="sm" striped>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Stock actual</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Vender</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, i) => (
            <TableProduct
              sale={false}
              edit={edit}
              product={product}
              actualSale={actualSale}
              setActualSale={setActualSale}
              key={i}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Home;
