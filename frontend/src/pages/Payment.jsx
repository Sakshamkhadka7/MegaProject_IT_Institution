import React from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
const API = import.meta.env.VITE_API_URL;

const Payment = () => {
  const { state } = useLocation();
  const total = state?.total;
  const order = state?.orderData;
  
  const transaction_uuid = order._id;
  const message = `total_amount=${total},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
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
        <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
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
          <h1 className="text-4xl text-center font-bold ">
            Total Amount To Pay Rs : {total}
          </h1>
          <input
            className="bg-orange-500  text-2xl  p-4 text-white text-center m-auto rounded-2xl px-35 py-5"
            value="Submit"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default Payment;
