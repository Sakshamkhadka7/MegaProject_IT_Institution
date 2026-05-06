import React, { useContext, useState } from "react";
import { CartContext } from "../context/AddToCart";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const Cart = () => {
  const { state, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const { cartItems } = state;

  //  IMPORTANT: loading state to prevent duplicate orders
  const [loading, setLoading] = useState(false);

  const subTotal = cartItems.reduce((acc, item) => {
    return acc + Number(item.fee);
  }, 0);

  const shipping = subTotal > 0 ? 100 : 0;
  const total = subTotal + shipping;

  const createOrder = async () => {
    //  prevent duplicate clicks
    if (loading) return;

    setLoading(true);

    try {
      let res = await fetch(`${API}/api/v1/order/createOrder`, {
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

      const data = await res.json(); //  IMPORTANT FIX

      if (res.ok) {
        toast.success("Order created Successfully");
        //  pass correct structured state
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
      console.log("Error occured at create order", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between mb-4">
      {/* CART ITEMS */}
      <div className="flex-col space-y-4 justify-center items-center">
        {cartItems.length > 0 ? (
          <section>
            {cartItems.map((item) => (
              <div
                className="w-60 md:w-160 p-5 shadow-2xl rounded-2xl space-y-3"
                key={item._id}
              >
                <h1 className="text-xl">Title: {item.title}</h1>
                <h1>Duration: {item.duration}</h1>

                <div className="flex justify-between items-center gap-10">
                  <h1 className="text-red-400 font-semibold">
                    Deadline: {item.enrollmentDeadline}
                  </h1>
                  <h1 className="text-blue-500 font-semibold">
                    Price: {item.fee}
                  </h1>
                </div>

                <div className="flex justify-between items-center gap-10">
                  <h1>Prerequisites: {item.prerequisities}</h1>

                  <MdDelete
                    onClick={() => {
                      dispatch({ type: "delete", payload: item });
                      
                    }}
                    size={24}
                    className="text-red-700 hover:cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div>No Cart Found</div>
        )}
      </div>

      {/* ORDER SUMMARY */}
      <div className="w-60 md:w-90 p-5 shadow-2xl rounded-2xl mt-9 h-80 space-y-6">
        <h1 className="font-semibold text-xl">Order Summary</h1>

        <div className="flex justify-between">
          <h1>Sub Total :</h1>
          <h1 className="font-semibold">Rs: {subTotal}</h1>
        </div>

        <div className="flex justify-between">
          <h1>Shipping Fee</h1>
          <h1 className="font-semibold">Rs: {shipping}</h1>
        </div>

        <div className="flex justify-between">
          <h1>Total</h1>
          <h1 className="font-semibold text-orange-400">Rs: {total}</h1>
        </div>

        <div>
          <button
            onClick={() => {
              if (cartItems.length === 0) {
                toast.error("No orders to proceed")
                return;
              }
              createOrder();
            }}
            disabled={loading} //  prevent double click
            className={`text-xl text-white px-14 py-2 rounded-xl ${
              loading ? "bg-gray-400" : "bg-orange-400"
            }`}
          >
            {loading ? "Processing..." : "Proceed To Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
