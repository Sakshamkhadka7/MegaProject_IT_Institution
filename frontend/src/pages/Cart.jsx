import React, { useContext, useState, useEffect } from "react";

import { CartContext } from "../context/AddToCart";
import { UserContext } from "../context/UserProvider";

import { useNavigate } from "react-router-dom";

import { MdDelete } from "react-icons/md";

import { toast } from "react-toastify";

import { motion } from "framer-motion";

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const Cart = () => {
  const { state, dispatch } = useContext(CartContext);

  const { user, loading: userLoading } = useContext(UserContext);

  const navigate = useNavigate();

  const { cartItems } = state;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      toast.warning("Please login first");

      navigate("/login");
    }
  }, [user, userLoading, navigate]);

  const subTotal = cartItems.reduce((acc, item) => acc + Number(item.fee), 0);

  const shipping = subTotal > 0 ? 100 : 0;

  const total = subTotal + shipping;

  const getMyPendingOrder = async () => {
    try {
      const res = await fetch(`${API}/api/v1/order/myPendingOrder`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        return data?.data;
      }

      return null;
    } catch (error) {
      console.log("Pending order error:", error);

      return null;
    }
  };

  const createOrder = async () => {
    if (loading) return;
    if (!user) {
      toast.warning("Please login first");

      navigate("/login");

      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");

      return;
    }

    setLoading(true);

    try {
      const existingOrder = await getMyPendingOrder();

      if (existingOrder) {
        toast.info("Resuming your pending payment");
        navigate("/payment", {
          state: {
            total,
            orderData: existingOrder,
          },
        });

        return;
      }

      const res = await fetch(`${API}/api/v1/order/createOrder`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          course: cartItems.map((item) => ({
            coursesId: item._id,
            quantity: 1,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order created successfully");

        navigate("/payment", {
          state: {
            total,
            orderData: data.data,
          },
        });
      } else {
        toast.error(data.message || "Order failed");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row justify-between gap-6 p-4"
    >
      
      <div className="flex flex-col space-y-4 w-full">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.02,
              }}
              className="bg-white p-5 rounded-2xl shadow-lg border"
            >
              <h1 className="text-xl font-semibold">{item.title}</h1>

              <p className="text-gray-600">Duration: {item.duration}</p>

              <div className="flex justify-between mt-2">
                <span className="text-red-500 font-semibold">
                  Deadline: {item.enrollmentDeadline}
                </span>

                <span className="text-blue-600 font-semibold">
                  Rs {item.fee}
                </span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <p className="text-gray-500 text-sm">{item.prerequisities}</p>

                <motion.div
                  whileTap={{
                    scale: 0.8,
                  }}
                >
                  <MdDelete
                    size={22}
                    onClick={() =>
                      dispatch({
                        type: "delete",
                        payload: item,
                      })
                    }
                    className="text-red-600 cursor-pointer"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="text-gray-500 text-center mt-10"
          >
            Your cart is empty
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{
          opacity: 0,
          x: 40,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        className="w-full md:w-96 bg-white p-6 rounded-2xl shadow-xl h-fit"
      >
        <h1 className="text-xl font-bold mb-4">Order Summary</h1>

        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>Rs {subTotal}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>Rs {shipping}</span>
        </div>

        <div className="flex justify-between font-bold text-lg mt-3">
          <span>Total</span>

          <span className="text-orange-500">Rs {total}</span>
        </div>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={createOrder}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-xl text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
