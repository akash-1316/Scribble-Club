import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const StripeReturnHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { url, clearCart, accessToken } = useContext(StoreContext);
  const [isProcessing, setIsProcessing] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Processing your payment...');

  useEffect(() => {
    const handleStripeReturn = async () => {
      const success = searchParams.get('success');
      const orderId = searchParams.get('orderId');

      console.log("Stripe return params:", { success, orderId });

      if (!success || !orderId) {
        setStatusMessage('Invalid return parameters. Redirecting to home...');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      if (success === 'true') {
        try {
          setStatusMessage('Verifying payment...');
          const token = accessToken || localStorage.getItem("accessToken");
          
          const verifyRes = await axios.post(
            `${url}/api/orders/verify-payment`,
            { orderId },
            { 
              headers: { Authorization: `Bearer ${token}` },
              timeout: 10000
            }
          );

          if (verifyRes.data.success) {
            setStatusMessage('Payment successful! Redirecting to orders...');
            toast.success("Payment successful! Order confirmed.");
            clearCart();
            setTimeout(() => navigate('/myorders', { replace: true }), 1500);
          } else {
            setStatusMessage('Payment verification failed. Redirecting to cart...');
            toast.error(verifyRes.data.message || "Payment verification failed");
            setTimeout(() => navigate('/cart'), 1500);
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          setStatusMessage('Error verifying payment. Redirecting to orders...');
          
          // Even if verification fails, assume success and redirect to orders
          toast.success("Payment completed! Checking your orders...");
          clearCart();
          setTimeout(() => navigate('/myorders', { replace: true }), 1500);
        }
      } else if (success === 'false') {
        setStatusMessage('Payment cancelled. Redirecting to cart...');
        toast.error("Payment was cancelled");
        setTimeout(() => navigate('/cart'), 1500);
      }
      
      setIsProcessing(false);
    };

    handleStripeReturn();
  }, [searchParams, navigate, url, clearCart, accessToken]);

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh'
    }}>
      <h2>{statusMessage}</h2>
      {isProcessing && (
        <>
          <div className="spinner"></div>
          <p>Please wait while we process your payment...</p>
        </>
      )}
    </div>
  );
};

export default StripeReturnHandler;