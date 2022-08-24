import axios from "axios";
import { useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { prependBaseUri } from "../baseUri";
import { ActualSaleContext } from "../contexts/actualSaleContext";
import { ProductContext } from "../contexts/productsContext";
import Table from "react-bootstrap/esm/Table";
import useInput from "../hooks/useInput";
import useInputPayment from "../hooks/useInputPayment";
import swal from "sweetalert";

const ConfirmSale = ({ show, setShow, total }) => {
  const { actualSale, setActualSale } = useContext(ActualSaleContext);
  const { setProducts } = useContext(ProductContext);
  const eft = useInputPayment(0);
  const mp = useInputPayment(0);
  const transf = useInputPayment(0);
  const soldTo = useInput('')
  const missing =
    Math.floor((total - eft.value - mp.value - transf.value) * 100) / 100;

  useEffect(() => {
    if (missing <= 0)
      eft.setValue(Math.floor((total - mp.value - transf.value) * 100) / 100);
  }, [eft.value]);
  useEffect(() => {
    if (missing <= 0)
      mp.setValue(Math.floor((total - eft.value - transf.value) * 100) / 100);
  }, [mp.value]);
  useEffect(() => {
    if (missing <= 0)
      transf.setValue(Math.floor((total - eft.value - mp.value) * 100) / 100);
  }, [transf.value]);

  const handleConfirmSale = () => {
    if (missing) swal({ text: "Completar monto total" });
    else
      axios
        .post(prependBaseUri("/api/sales/confirm"), [
          Number(eft.value),
          Number(mp.value),
          Number(transf.value),
          soldTo.value,
          ...actualSale,
        ])
        .then(() => {
          actualSale.forEach((product) => {
            product.stock -= product.quantity;
            return axios.put(
              prependBaseUri(`/api/products/edit/${product.id}`),
              product
            );
          });
        })
        .then(() => axios.get(prependBaseUri("/api/products/all")))
        .then((res) => res.data)
        .then((newStockList) => {
          setProducts(newStockList);
          setActualSale([]);
          eft.setValue(0)
          mp.setValue(0)
          transf.setValue(0)
          setShow(false)
        })
        .catch((err) => console.log(err));
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Venta / Metodo de pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Monto total: $ {total}</p>
          <p>Vendido a: <Form.Control {...soldTo} /></p>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Metodo</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Efectivo</td>
                <td>
                  <Form.Control type="number" {...eft} />
                </td>
              </tr>
              <tr>
                <td>Mercado Pago</td>
                <td>
                  <Form.Control type="number" {...mp} />
                </td>
              </tr>
              <tr>
                <td>Transferencia</td>
                <td>
                  <Form.Control type="number" {...transf} />
                </td>
              </tr>
            </tbody>
          </Table>
          <p>Faltante: $ {missing}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmSale}>
            Confirmar Compra
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmSale;
