import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";

const SaleDetail = () => {
  const { orderNumber } = useParams();
  const [singleSale, setSingleSale] = useState([]);
  const total = singleSale.reduce((pv, cv) => cv.price * cv.quantity + pv, 0);

  useEffect(() => {
    axios
      .get(`/api/sales/one/${orderNumber}`)
      .then((res) => res.data)
      .then((sale) => {
        setSingleSale(sale);
      });
  }, [orderNumber]);

  return (
    <Table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoria</th>
          <th>Cantidad</th>
          <th>Precio unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      {singleSale[0] &&
        singleSale.map((sale, i) => (
          <tbody key={i}>
            <tr>
              <td>{sale.product.name}</td>
              <td>{sale.product.category}</td>
              <td>{sale.quantity}</td>
              <td>$ {sale.price}</td>
              <td>$ {sale.quantity * sale.price}</td>
            </tr>
          </tbody>
        ))}
      <tfoot>
        <tr>
          <td />
          <td />
          <td />
          <td />
          <td>Total: $ {total}</td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default SaleDetail;
