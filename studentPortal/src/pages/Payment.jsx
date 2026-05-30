import React, { Suspense, useEffect, useState } from "react";

import { useLocation, Navigate } from "react-router-dom";

import CryptoJS from "crypto-js";

const API = "http://localhost:3001";

const Loading = React.lazy(() => import("../components/Loading"));

const Payment = () => {
  const { state } = useLocation();

  const [transactionUuid, setTransactionUuid] = useState("");

  const [loading, setLoading] = useState(true);

  if (!state?.order || !state?.course?.length) {
    return <Navigate to="/access/order" />;
  }

  const { order, course } = state;

  const orderId = order._id;

  useEffect(() => {
    const regenerateUuid = async () => {
      try {
        const res = await fetch(
          `${API}/api/v1/order/regenerateTransaction/${orderId}`,
          {
            method: "PUT",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setTransactionUuid(data.data.transactionUuid);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("UUID regeneration error", error);
      } finally {
        setLoading(false);
      }
    };

    if (order?._id) {
      regenerateUuid();
    }
  }, [order]);

  const amount = course.reduce((total, item) => {
    const fee = item?.coursesId?.fee || 0;

    const qty = item?.quantity || 1;

    return total + fee * qty;
  }, 0);

  const product_service_charge = 100;

  const product_delivery_charge = 0;

  const total_amount =
    amount + product_service_charge + product_delivery_charge;

  const message = `total_amount=${total_amount},transaction_uuid=${transactionUuid},product_code=EPAYTEST`;

  const hash = CryptoJS.HmacSHA256(message, "8gBm/:&EnhH.1/q");

  const signature = CryptoJS.enc.Base64.stringify(hash);

  if (loading || !transactionUuid) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Loading />
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-gray-500">
          Loading payment...
        </div>
      }
    >
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Selected Courses</h2>

            {course.map((item, index) => (
              <div key={index} className="flex gap-3 border-b py-3">
                <img
                  src={item.coursesId?.thumbnail}
                  className="w-16 h-16 object-cover rounded"
                  alt=""
                />

                <div>
                  <h3 className="font-semibold">
                    {item.coursesId?.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Fee: Rs {item.coursesId?.fee} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Payment Summary
            </h2>

            <div className="space-y-3 text-gray-600">
              <p>Subtotal: Rs {amount}</p>

              <p>
                Service Charge: Rs {product_service_charge}
              </p>

              <p>
                Delivery: Rs {product_delivery_charge}
              </p>
            </div>

            <div className="border-t mt-6 pt-4">
              <h1 className="text-2xl font-bold">
                Total: Rs {total_amount}
              </h1>
            </div>

            <form
              action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
              method="POST"
              className="mt-6"
            >
              <input
                type="hidden"
                name="amount"
                value={amount}
              />

              <input
                type="hidden"
                name="tax_amount"
                value="0"
              />

              <input
                type="hidden"
                name="total_amount"
                value={total_amount}
              />

              <input
                type="hidden"
                name="transaction_uuid"
                value={transactionUuid}
              />

              <input
                type="hidden"
                name="product_code"
                value="EPAYTEST"
              />

              <input
                type="hidden"
                name="product_service_charge"
                value={product_service_charge}
              />

              <input
                type="hidden"
                name="product_delivery_charge"
                value={product_delivery_charge}
              />

              <input
                type="hidden"
                name="success_url"
                value="http://localhost:5174/access/success"
              />

              <input
                type="hidden"
                name="failure_url"
                value="http://localhost:5174/access/failure"
              />

              <input
                type="hidden"
                name="signed_field_names"
                value="total_amount,transaction_uuid,product_code"
              />

              <input
                type="hidden"
                name="signature"
                value={signature}
              />

              <button className="w-full mt-6 bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl">
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Payment;