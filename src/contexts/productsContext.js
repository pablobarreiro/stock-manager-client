import { React, createContext, useState } from "react";

const initialState = [];

export const ProductContext = createContext(initialState);

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
