import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SaleGroup = ({ products }) => {
  const [total, setTotal] = useState();

  useEffect(() => {
    setTotal(0);
    let totalAux = 0;
    products.forEach(
      (product) => (totalAux += product.quantity * product.price)
    );
    totalAux = Math.round(totalAux * 100) / 100;
    setTotal(totalAux);
  }, []);

  return (
    <tbody>
      <tr>
        <td>{products[0].createdAt.slice(0, 10)}</td>
        <td>{products[0].order_number}</td>
        <td>
          <span>$ {total}</span>
        </td>
        <td>
          <Link to={`/history/${products[0].order_number}`}>Detalles</Link>
        </td>
      </tr>
    </tbody>
  );
};

export default SaleGroup;
