const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({ region: process.env.AWS_REGION || "ap-south-1" });

exports.handler = async (event) => {
    console.log("Processing SQS events:", JSON.stringify(event));

    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body);
            const { type, recipientEmail, recipientName, subject, data } = body;

            console.log(`Handling notification type: ${type} for ${recipientEmail}`);

            let htmlBody = "";
            if (type === "PAYMENT_SUCCESS") {
                htmlBody = `
                    <h1>Payment Successful</h1>
                    <p>Hi ${recipientName},</p>
                    <p>We've received your payment of ₹${data.amount}.</p>
                    <p>Order ID: #${data.orderId}</p>
                    <p>Transaction ID: ${data.transactionId}</p>
                `;
            } else if (type === "ORDER_CONFIRMATION") {
                htmlBody = `
                    <h1>Order Confirmation</h1>
                    <p>Hi ${recipientName},</p>
                    <p>Your order for "${data.paintingTitle}" has been placed successfully.</p>
                    <p>Order ID: #${data.orderId}</p>
                    <p>Amount: ₹${data.amount}</p>
                    <p>Payment Method: ${data.paymentMethod}</p>
                    <p>Address: ${data.address}</p>
                `;
            }

            const params = {
                Source: process.env.EMAIL_FROM,
                Destination: {
                    ToAddresses: [recipientEmail],
                },
                Message: {
                    Subject: { Data: subject },
                    Body: {
                        Html: { Data: htmlBody },
                    },
                },
            };

            await ses.send(new SendEmailCommand(params));
            console.log(`Email sent successfully to ${recipientEmail}`);

        } catch (error) {
            console.error("Error processing record:", error);
        }
    }
};
