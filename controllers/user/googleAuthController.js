import queryString from 'query-string';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import "dotenv/config";
import { User } from '../../models/user.js';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL, FRONTEND_URL, SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

export const googleAuth = async (req, res) => {
    const stringifiedParams = queryString.stringify({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `${BASE_URL}/users/google-redirect`,
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ].join(" "),
        response_type: "code",
        access_type: "offline",
        prompt: "consent",
    });

    console.log(`Redirecting to Google Auth: ${stringifiedParams}`);

    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`);
}

export const googleRedirect = async (req, res) => {
    try {
        const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

        console.log(`Full URL: ${fullUrl}`);

        const urlObj = new URL(fullUrl);
        const urlParams = queryString.parse(urlObj.search);
        const code = urlParams.code;

        console.log(`Authorization code: ${code}`);

        const tokenData = await axios({
            url: 'https://oauth2.googleapis.com/token',
            method: "post",
            data: {
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: `${BASE_URL}/users/google-redirect`,
                grant_type: "authorization_code",
                code,
            },
        });

        console.log(`Token Data: ${JSON.stringify(tokenData.data)}`);

        const userData = await axios({
            url: "https://www.googleapis.com/oauth2/v2/userinfo",
            method: "get",
            headers: {
                Authorization: `Bearer ${tokenData.data.access_token}`,
            },
        });

        console.log(`User Data: ${JSON.stringify(userData.data)}`);

        const { email, name } = userData.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name,
                isVerified: true,
                password: '',
            });
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '30d' });

        await User.findByIdAndUpdate(user._id, { token, refreshToken });

        console.log(`Redirecting to: ${FRONTEND_URL}/tracker?token=${token}&refreshToken=${refreshToken}`);

        return res.redirect(`${FRONTEND_URL}/tracker?token=${token}&refreshToken=${refreshToken}`);
    } catch (error) {
        console.error('Error during Google redirect:', error);
        return res.status(500).send('Internal Server Error');
    }
}
