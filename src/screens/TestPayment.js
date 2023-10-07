// import React, { useState } from 'react';
// import { View, Text, Button } from 'react-native';
// // Assuming that the onlinepayments SDK has a React Native compatible version
// import { Session, onlinepayments } from 'onlinepayments-sdk-client-js';

// const TestPayment = () => {
//     const [outputMessage, setOutputMessage] = useState('');

//     const sessionDetails = {
//         assetUrl: "",
//         clientApiUrl: "",
//         clientSessionId: "",
//         customerId: ""
//     };

//     const paymentDetails = {
//         totalAmount: 1000,
//         countryCode: "DE",
//         locale: "de_DE",
//         currency: "EUR",
//         isRecurring: false
//     };

//     const cardNumber = '4567 3500 0042 7977';

//     const session = new onlinepayments(sessionDetails);

//     const createPayload = async (session, cardNumber, paymentDetails) => {
//         try {
//             const iinDetailsResponse = await session.getIinDetails(cardNumber, paymentDetails);
            
//             if (iinDetailsResponse.status !== "SUPPORTED") {
//                 console.error("Card check error: " + iinDetailsResponse.status);
//                 setOutputMessage('Something went wrong, check the console for more information.');
//                 return;
//             }

//             const paymentProduct = await session.getPaymentProduct(iinDetailsResponse.paymentProductId, paymentDetails);

//             const paymentRequest = session.getPaymentRequest();
//             paymentRequest.setPaymentProduct(paymentProduct);
//             paymentRequest.setValue("cardNumber", cardNumber);
//             paymentRequest.setValue("cvv", "123");
//             paymentRequest.setValue("expiryDate", "04/20");

//             if (!paymentRequest.isValid()) {
//                 for (var error in paymentRequest.getErrorMessageIds()) {
//                     console.error('error', error);
//                 }
//             }

//             const paymentHash = await session.getEncryptor().encrypt(paymentRequest);
//             setOutputMessage('Encrypted to: ' + paymentHash);

//         } catch (error) {
//             console.error(error.message);
//             setOutputMessage('Something went wrong, check the console for more information.');
//         }
//     }

//     return (
//         <View style={{ padding: 20 }}>
//             <Button title="Create Payload" onPress={() => createPayload(session, cardNumber, paymentDetails)} />
//             <Text>{outputMessage}</Text>
//         </View>
//     );
// }

// export default TestPayment