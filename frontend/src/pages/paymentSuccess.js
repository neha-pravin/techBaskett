import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Context from "../context";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const context = useContext(Context);


  // Get payment params from navigation state or fallback to URL
  const state = location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const amount = state.amount || searchParams.get("amount");
  const transaction_id =
    state.transaction_id || searchParams.get("transaction_id");
  const mobile = state.mobile || searchParams.get("mobile");
  const purchase_order_name =
    state.purchase_order_name || searchParams.get("purchase_order_name");
  const pidx = state.pidx || searchParams.get("pidx");
  const purchase_order_id =
    state.purchase_order_id ||
    searchParams.get("purchase_order_id") ||
    sessionStorage.getItem("purchase_order_id");

  useEffect(() => {
    const completePayment = async () => {
      try {
        // Call your backend to verify/complete payment
        const res = await axios.get(
          `http://localhost:8080/api/complete-khalti-payment?pidx=${pidx}&transaction_id=${transaction_id}&amount=${amount}&mobile=${mobile}&purchase_order_name=${purchase_order_name}&purchase_order_id=${purchase_order_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.data && res.data.success) {
          setSuccess(true);
          // Clear cart after successful payment
          context.fetchUserAddToCart();
        } else {
          setError("Payment verification failed.");
        }
      } catch (err) {
        setError("Payment verification failed.");
      }
      setLoading(false);
      // Redirect to home after 3 seconds
      setTimeout(() => navigate("/"), 3000);
    };

    if (pidx && transaction_id && amount && purchase_order_id) {
      completePayment();
    } else {
      setError("Missing payment information.");
      setLoading(false);
      setTimeout(() => navigate("/"), 3000);
    }
  }, [
    pidx,
    transaction_id,
    amount,
    mobile,
    purchase_order_name,
    purchase_order_id,
    navigate,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">
              Verifying your payment...
            </h2>
          </>
        ) : success ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Payment Successful!
            </h2>
            <p className="mb-2">Thank you for your purchase.</p>
            <p className="text-slate-600 text-sm">
              Redirecting to home page...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Payment Failed
            </h2>
            <p className="mb-2">{error}</p>
            <p className="text-slate-600 text-sm">
              Redirecting to home page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
