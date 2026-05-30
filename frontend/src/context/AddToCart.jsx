import { useEffect } from "react";
import { useReducer } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

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
      const isExists = state.cartItems.find((item) => {
        return item._id == action.payload._id;
      });

      if (isExists) {
        toast.warning("Course already exists ⚠️");
        return state;
      }

      const newObj = [...state.cartItems, action.payload];
      toast.success("Course is successfully added to cart");
      return {
        ...state,
        cartItems: newObj,
      };
    }

    case "delete": {
      const newObject = state.cartItems.filter(
        (item) => item._id !== action.payload._id,
      );
      toast.error("Cart is deleted");

      return {
        ...state,
        cartItems: newObject,
      };
    }

    case "clear": {
      return {
        cartItems: [],
      };
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cardReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
