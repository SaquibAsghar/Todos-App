const jwt = require("json-web-token");
const User = require("../database/models/user-model");
const authenticate = async (req, res, next) => {
	try {
		const secretKey = "thisismynewuser";
		const token = req.header("Authorization").replace("Bearer ", "");
		const decodePayload = jwt.decode(secretKey, token);
		const user = await User.findOne({
			_id: decodePayload.value._id,
			"tokens.token": token,
		});

        if(!user){
            throw new Error("Invalid user")
        }
        req.user = user
        // console.log(req.user)
		next();
	} catch (error) {
		return res.status(401).send({ error: "Please authenticate yourself" });
	}
};

module.exports = authenticate;
