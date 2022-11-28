import React from 'react'
import { Box, Stack } from "@chakra-ui/react"
import Card from './Card'
import axios from "axios";


const Home = () => {
    const checkoutHandler = async (amount) => {

        const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
            amount
        });

        const options = {
            key: "rzp_test_EI6r8BZdNAcrUq",
            amount: order.amount,
            currency: "INR",
            name: "Sai Manikanta",
            description: "Tutorial of RazorPay",
            image: "https://avatars.githubusercontent.com/u/25058652?v=4",
            order_id: order.id,
            "handler": function (response) {
                const data = {
                    orderCreationId: order.id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                };

                axios.post("http://localhost:4000/api/paymentverification", data)

                alert('Success')
            },
            // callback_url: "http://localhost:4000/api/paymentverification",
            prefill: {
                name: "Sai Manikanta",
                email: "mani333007@gmail.com",
                contact: "9618021355"
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#395061"
            }
        };
        const razor = new window.Razorpay(options);
        razor.on('payment.failed', function (response) {
            // alert(response.error.code);
            // alert(response.error.description);
            // alert(response.error.source);
            // alert(response.error.step);
            // alert(response.error.reason);
            // alert(response.error.metadata.order_id);
            // alert(response.error.metadata.payment_id);
            alert('Failed')
        });
        razor.open();
    }

    return (
        <Box>
            <Stack h={"100vh"} alignItems="center" justifyContent="center" direction={["column", "row"]}>
                <Card amount={5000} img={"https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png"} checkoutHandler={checkoutHandler} />
                <Card amount={3000} img={"http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"} checkoutHandler={checkoutHandler} />
            </Stack>
        </Box>
    )
}

export default Home