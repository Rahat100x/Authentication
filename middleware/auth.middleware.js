import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
    try {
        console.log(req.cookies);
        const token = req.cookies?.token;
        console.log("Token found: ", token ? "YES" : "NO");

        if (!token) {
            console.log("No token!");
            return res.status(401).json({
                success: false,
                message: "Authentication failed!"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded data: ", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Auth middleware failure!", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
