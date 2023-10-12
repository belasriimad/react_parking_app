import React, { useState } from 'react';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { PaymentElement } from "@stripe/react-stripe-js";
import { toast } from 'react-toastify';


export default function CheckoutForm({setAmount}) {
    const stripe = useStripe();
    const elements = useElements();
    const[message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        const response = await stripe.confirmPayment({
            elements,
            confirmParams: {

            },
            redirect: 'if_required'
        });

        if(response.error && response.error.type === 'card_error' || response.error && response.error.type === 'validation_error') {
            setMessage(response.error.message);
            setIsProcessing(false);
        }else if(response.paymentIntent.id) {
            setIsProcessing(false);
            localStorage.removeItem('amount');
            setAmount(0);
            toast.success("Payment done successfully thank you!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    return (
        <form id='payment-form' onSubmit={handleSubmit}>
            <PaymentElement id='payment-element' />
            <button disabled={isProcessing || !stripe || !elements} type="submit">
                <span id="button-text">
                    {isProcessing ? 'Processing...' : 'Pay now'}
                </span>
            </button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    )
}
