import sendGridMail from "@sendgrid/mail";
import "dotenv/config"

const { SENDGRID_API_KEY } = process.env;

sendGridMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
    const email = { ...data, from: 'aqua-track@meta.ua' };
    await sendGridMail.send(email);
    return true;
}

export default sendEmail;