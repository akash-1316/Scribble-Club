import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from "react-toastify";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url, accessToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        if (!accessToken) {
            toast.error("Please login to verify payment");
            navigate("/login");
            return;
        }
        try {
            const response = await axios.post(
                `${url}/api/orders/verify`,
                { success, orderId },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (response.data.success) {
                toast.success("Order placed successfully!");
                navigate("/myorders");
            } else {
                toast.error(response.data.message || "Payment verification failed");
                navigate("/");
            }
        } catch (err) {
            console.error("Verify payment error:", err);
            toast.error("Something went wrong while verifying payment");
            navigate("/");
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;
