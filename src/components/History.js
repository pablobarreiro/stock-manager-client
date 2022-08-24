import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { groupBy } from "../utils/functions";
import SaleGroup from "./SaleGroup";
import Table from "react-bootstrap/Table";
import { prependBaseUri } from "../baseUri";

const History = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allSales, setAllSales] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    axios
      .get(prependBaseUri("/api/sales/all"))
      .then((res) => res.data)
      .then((sales) => {
        const historySales = groupBy(sales, "order_number");
        setAllSales(historySales);
      });
  }, [location.pathname]);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Numero de venta</th>
            <th>Vendido a</th>
            <th>Total</th>
            <th>Ver Detalles</th>
          </tr>
        </thead>
        {Object.keys(allSales).map((orderNumber, i) => (
          <SaleGroup products={allSales[orderNumber]} key={i} />
        ))}
      </Table>
    </div>
  );
};

export default History;
