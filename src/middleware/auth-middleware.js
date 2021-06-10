const jwt = require("json-web-token");
const User = require("../database/models/user-model");
const authenticate = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decodePayload = jwt.decode(process.env.JWT_SECRET, token);
		const user = await User.findOne({
			_id: decodePayload.value._id,
			"tokens.token": token,
		});

        if(!user){
            throw new Error("Invalid user")
        }
        req.user = user
		next();
	} catch (error) {
		return res.status(401).send({ error: "Please authenticate yourself" });
	}
};

module.exports = authenticate;
