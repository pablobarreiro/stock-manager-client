import "./styles/general.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./components/NavigationBar";
import Login from "./components/Log";
import Footer from "./components/Footer";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./contexts/authContext";
import { ProductContextProvider } from "./contexts/productsContext";
import { ActualSaleContextProvider } from "./contexts/actualSaleContext";
import { useState } from "react";
import History from "./components/History";
import SaleDetail from "./components/SaleDetail";

function App() {
  const [edit, setEdit] = useState(false);
  const handleEdit = () => {
    setEdit(!edit);
  };

  return (
    <ActualSaleContextProvider>
      <ProductContextProvider>
        <AuthContextProvider>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "100vh",
              paddingLeft: "2%",
              paddingRight: "2%",
            }}
          >
            <div>
              <NavigationBar handleEdit={handleEdit} edit={edit} />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home edit={edit} />} />
                <Route path="/history" element={<History />} />
                <Route path="/history/:orderNumber" element={<SaleDetail />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthContextProvider>
      </ProductContextProvider>
    </ActualSaleContextProvider>
  );
}

export default App;
