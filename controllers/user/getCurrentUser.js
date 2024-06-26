export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { _id, name, email, avatar, gender, weight, dailyActivityTime, dailyWaterNorm, token, refreshToken, isVerified } = req.user;

        res.json({
            _id,
            name, email, avatar, gender, weight, dailyActivityTime, dailyWaterNorm, token, refreshToken, isVerified
        })
    } catch (error) {
        next(error)
    }
}