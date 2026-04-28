const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const ses = new SESClient({ region: "ap-south-1" });
const sm = new SecretsManagerClient({ region: "ap-south-1" });

let cachedSenderEmail = null;

// Retrieves sender email from Secrets Manager
async function getSenderEmail() {
    if (cachedSenderEmail) return cachedSenderEmail;
    try {
        const response = await sm.send(new GetSecretValueCommand({ SecretId: "FusionArt" }));
        const secrets = JSON.parse(response.SecretString);
        cachedSenderEmail = secrets.EMAIL_USERNAME; 
        return cachedSenderEmail;
    } catch (error) {
        console.error("Secret Retrieval Error:", error);
        return process.env.EMAIL_FROM; // Fallback
    }
}

exports.handler = async (event) => {
    const senderEmail = await getSenderEmail();
    
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body);
            const { type, recipientEmail, recipientName, subject, data } = body;

            // Premium Art-Themed Styles
            const styles = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
                    .main-body { font-family: 'Inter', sans-serif; background-color: #f8f5f2; padding: 40px 20px; }
                    .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                    .header { background-color: #1a1a1a; padding: 60px 40px; text-align: center; border-bottom: 5px solid #d4af37; }
                    .logo { color: #d4af37; font-family: 'Playfair Display', serif; font-size: 32px; letter-spacing: 4px; margin: 0; }
                    .content { padding: 50px 60px; color: #2d2d2d; line-height: 1.8; }
                    .stat-box { background-color: #1a1a1a; color: #ffffff; border-radius: 16px; padding: 30px; margin: 30px 0; border-left: 6px solid #d4af37; }
                    .footer { background-color: #f8f5f2; padding: 40px; text-align: center; color: #888888; font-size: 13px; }
                </style>
            `;

            let bodyHtml = "";
            if (type === "PAYMENT_SUCCESS") {
                bodyHtml = `
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #1a1a1a;">Receipt of Investment</h2>
                    <p>Dear ${recipientName}, Your account has been successfully credited.</p>
                    <div class="stat-box">
                        <table width="100%">
                            <tr>
                                <td><span style="color: #d4af37; font-size: 12px; text-transform: uppercase;">Amount Credited</span><br><span style="font-size: 24px; font-weight: 700;">₹${data.amount}</span></td>
                                <td align="right"><span style="color: #d4af37; font-size: 12px; text-transform: uppercase;">Status</span><br><span style="font-size: 18px;">Verified</span></td>
                            </tr>
                        </table>
                    </div>
                    <p style="font-size: 14px; color: #666;">Transaction Hash: ${data.transactionId}</p>
                `;
            } else if (type === "ORDER_CONFIRMATION") {
                bodyHtml = `
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #1a1a1a;">Acquisition Confirmed</h2>
                    <p>Dear ${recipientName}, We are honored to confirm your successful acquisition of a new masterpiece.</p>
                    <div style="margin: 40px 0; border: 1px solid #e0e0e0; border-radius: 20px; overflow: hidden;">
                        <div style="background-color: #1a1a1a; padding: 25px 40px;"><h3 style="color: #d4af37; margin: 0; font-family: 'Playfair Display', serif;">${data.paintingTitle}</h3></div>
                        <div style="padding: 30px 40px;">
                            <table width="100%">
                                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 15px 0; color: #888;">Catalog Reference</td><td style="padding: 15px 0; text-align: right; font-weight: 600;">#ORD-${data.orderId}</td></tr>
                                <tr><td style="padding: 15px 0; color: #888;">Acquisition Value</td><td style="padding: 15px 0; text-align: right; font-weight: 600;">₹${data.amount}</td></tr>
                            </table>
                        </div>
                    </div>
                `;
            }

            const htmlContent = `<!DOCTYPE html><html><head>${styles}</head><body class="main-body"><div class="container"><div class="header"><h1 class="logo">FUSION ART</h1><p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">Private Collection</p></div><div class="content">${bodyHtml}</div><div class="footer"><p>Fusion Art International • Mumbai • London • New York</p></div></div></body></html>`;

            await ses.send(new SendEmailCommand({
                Source: senderEmail, 
                Destination: { ToAddresses: [recipientEmail] },
                Message: {
                    Subject: { Data: subject },
                    Body: { Html: { Data: htmlContent } },
                },
            }));
            console.log(`Notification sent for ${recipientEmail}`);

        } catch (error) {
            console.error("Processing Error:", error);
        }
    }
};
