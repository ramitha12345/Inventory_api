const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, "secret");
        if (decoded) {

            req.userId = decoded.data;
            next();
        } else {
            throw new Error()
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(401);
    }
};