import { React, createContext, useState } from "react";

const initialState = [];

export const ActualSaleContext = createContext(initialState);

export const ActualSaleContextProvider = ({ children }) => {
  const [actualSale, setActualSale] = useState([]);

  return (
    <ActualSaleContext.Provider value={{ actualSale, setActualSale }}>
      {children}
    </ActualSaleContext.Provider>
  );
};
