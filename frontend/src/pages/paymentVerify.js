import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PaymentVerify = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  // Extract relevant params
  const status = params.get('status');
  const amount = params.get('amount');
  const purchase_order_name = params.get('purchase_order_name');
  const transaction_id = params.get('transaction_id');
  const mobile = params.get('mobile');
  const pidx = params.get('pidx');
  const purchase_order_id = params.get('purchase_order_id') || sessionStorage.getItem('purchase_order_id'); // get from URL or sessionStorage

  useEffect(() => {
    if (status === 'Completed') {
      navigate('/payment-success', {
        state: { amount, purchase_order_name, transaction_id, mobile, pidx, purchase_order_id }
      });
    }
  }, [status, amount, purchase_order_name, transaction_id, mobile, pidx, purchase_order_id, navigate]);

  if (status === 'Completed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white shadow-md rounded p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Redirecting to Payment Success...</h2>
        </div>
      </div>
    );
  }

  // Show error if payment not completed
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h2>
        <div className="text-left space-y-2">
          <p><span className="font-semibold">Order:</span> {purchase_order_name}</p>
          <p><span className="font-semibold">Amount:</span> {amount ? `Rs. ${(amount/100).toFixed(2)}` : '-'}</p>
          <p><span className="font-semibold">Transaction ID:</span> {transaction_id}</p>
          <p><span className="font-semibold">Mobile:</span> {mobile}</p>
        </div>
        <div className="mt-6">
          <a href="/" className="text-blue-600 underline">Go to Home</a>
        </div>
      </div>
    </div>
  )
}

export default PaymentVerify