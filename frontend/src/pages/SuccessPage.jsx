import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "../context/AddToCart";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const {dispatch}=useContext(CartContext);
  const navigate = useNavigate();
  const rawData = searchParams.get("data");
  const data = rawData ? JSON.parse(atob(rawData)) : null;
  console.log(data);

  const updateOrder = async () => {
    try {
      let res = await fetch(
        `${API}/api/v1/order/updateOrder/${data.transaction_uuid}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus: data.status }),
        },
      );

      if (res.ok) {
        toast.success("Order status updated successfully");
        dispatch({type:"clear"});
      }
    } catch (error) {
      console.log("Error occured at success page of updateOrder", error);
    }
  };

  useEffect(()=>{
    updateOrder()
  },[])

  return (
    <div className=" w-120 h-70 p-8 m-auto shadow space-y-6 mb-9 mt-8">
      <h1 className="text-3xl font-bold text-center mt-10 text-green-700">
        Payment is Successfull
      </h1>
      <div className="flex-col justify-center items-start text-center ">
        <h1 className="text-2xl">Total Amount : {data.total_amount}</h1>
        <h1 className="text-2xl">Transaction Code : {data.transaction_code}</h1>
        <button
          onClick={() => navigate("/courses")}
          className="border px-20 py-1 mt-4 bg-amber-400 text-white text-xl hover:cursor-pointer"
        >
          Back To Course
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
