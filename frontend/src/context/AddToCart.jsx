import { useEffect } from "react";
import { useReducer } from "react";
import { createContext } from "react";

export const CartContext = createContext();

const getProduct = () => {
  let res = localStorage.getItem("cart");

  return res ? JSON.parse(res) : [];
};

const initialState = {
  cartItems: getProduct(),
};

const cardReducer = (state, action) => {
  switch (action.type) {
    case "addToCart": {
      console.log(action.payload);

      const isExists = state.cartItems.find((item) => {
        return item.id == action.payload.id;
      });
    
      if (isExists) {
        alert("Product is already exists");
        return state;
      }
    
      console.log(state);

      const newObj = [...state.cartItems, action.payload];
      alert("Product is added")
      return {
        cartItems: newObj,
      };
    }
    case "default": {
      return state;
    }
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cardReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cartItems));
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
