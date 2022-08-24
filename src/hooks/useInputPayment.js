import { useState } from "react";

export const useInputPayment = (initialValue) => {
  const [value, setValue] = useState(
    initialValue || initialValue === 0 ? initialValue : ""
  );

  const onChange = (e) => {
    if (e.target.value <= 0) setValue(0)
    else setValue(e.target.value);
  };

  return { value, onChange, setValue };
};

export default useInputPayment;
