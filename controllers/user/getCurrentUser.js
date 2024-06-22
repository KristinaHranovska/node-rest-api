export const getCurrentUser = async (req, res) => {
    try {
        const { _id, name, email, avatarURL, gender, weight, dailyActivityTime, dailyWaterNorm, token, refreshToken, isVerified } = req.user;

        res.json({
            _id,
            name, email, avatarURL, gender, weight, dailyActivityTime, dailyWaterNorm, token, refreshToken, isVerified
        })
    } catch (error) {
        next(error)
    }
}