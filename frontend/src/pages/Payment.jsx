import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

const API = import.meta.env.VITE_API_URL 
// const API = "http://localhost:3001";

const Payment = () => {
  const { state } = useLocation();

  const total = state?.total;

  const order = state?.orderData;

  const [transactionUuid, setTransactionUuid] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const regenerateUuid = async () => {
      try {
        const res = await fetch(
          `${API}/api/v1/order/regenerateTransaction/${order._id}`,
          {
            method: "PUT",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setTransactionUuid(data.data.transactionUuid);
          console.log(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("UUID regeneration error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (order?._id) {
      regenerateUuid();
    }
  }, [order]);

  if (!order) {
    return (
      <div className="text-center mt-20 text-2xl font-semibold">
        No Orders Found
      </div>
    );
  }

  if (loading || !transactionUuid) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const message = `total_amount=${total},transaction_uuid=${transactionUuid},product_code=EPAYTEST`;

  let hash = CryptoJS.HmacSHA256(message, "8gBm/:&EnhH.1/q");

  let signature = CryptoJS.enc.Base64.stringify(hash);

  return (
    <div className="p-10">
      <form
        className="space-y-3 p-6 shadow-xl rounded-xl"
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
      >
        <input type="hidden" name="amount" value={total} required />

        <input type="hidden" name="tax_amount" value="0" />

        <input type="hidden" name="total_amount" value={total} />

        <input
          type="hidden"
          name="transaction_uuid"
          value={transactionUuid}
        />

        <input type="hidden" name="product_code" value="EPAYTEST" />

        <input type="hidden" name="product_service_charge" value="0" />

        <input type="hidden" name="product_delivery_charge" value="0" />

        <input
          type="hidden"
          name="success_url"
          value="http://localhost:5173/success"
        />

        <input
          type="hidden"
          name="failure_url"
          value="http://localhost:5173/failure"
        />

        <input
          type="hidden"
          name="signed_field_names"
          value="total_amount,transaction_uuid,product_code"
        />

        <input type="hidden" name="signature" value={signature} />

        <div className="flex flex-col justify-center items-center space-y-10">
          <h1 className="text-4xl text-center font-bold">
            Total Amount To Pay Rs : {total}
          </h1>

          <input
            className="bg-orange-500 text-2xl p-4 text-white text-center m-auto rounded-2xl px-35 py-5 hover:bg-orange-600 cursor-pointer"
            value="Submit"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default Payment;