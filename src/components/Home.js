import axios from "axios";
import { useContext, useEffect, useState } from "react";
import TableProduct from "../commons/TableProducts";
import { AuthContext } from "../contexts/authContext";
import { ProductContext } from "../contexts/productsContext";
import { ActualSaleContext } from "../contexts/actualSaleContext";
import useInput from "../hooks/useInput";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { prependBaseUri } from "../baseUri";


const Home = ({ edit }) => {
  const navigate = useNavigate();
  const [toggled, setToggled] = useState(false);
  const search = useInput("");
  const { actualSale, setActualSale } = useContext(ActualSaleContext);
  const { products, setProducts } = useContext(ProductContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const total = actualSale.reduce((pv, cv) => cv.price * cv.quantity + pv, 0);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    axios
      .get(prependBaseUri("/api/products/all"))
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
      .post(prependBaseUri("/api/sales/confirm"), actualSale)
      .then(() => {
        actualSale.forEach((product) => {
          product.stock -= product.quantity;
          return axios.put(prependBaseUri(`/api/products/edit/${product.id}`), product);
        });
      })
      .then(() => axios.get(prependBaseUri("/api/products/all")))
      .then((res) => res.data)
      .then((newStockList) => {
        setProducts(newStockList);
        setActualSale([]);
      })
      .catch((err) => console.log(err));
  };

  const handleLowStock = () => {
    let newProducts = [];
    products.forEach((product) =>
      product.stock <= 5 ? newProducts.push(product) : null
    );
    setProducts(newProducts);
    setToggled(true);
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
            <TableProduct sale={true} product={product} key={i} />
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

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label>Buscar por nombre o categoria: </label>
        {!toggled ? (
          <Button onClick={handleLowStock}> Poco Stock </Button>
        ) : (
          <Button
            onClick={() =>
              axios
                .get("/api/products/all")
                .then((res) => res.data)
                .then((prod) => {
                  setProducts(prod);
                  setToggled(false);
                })
            }
          >
            {" "}
            Todos los productos{" "}
          </Button>
        )}
      </div>
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
            <TableProduct sale={false} edit={edit} product={product} key={i} />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Home;
