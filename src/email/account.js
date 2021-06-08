const mailgun = require("mailgun-js");
const mailgunAPIKey = "2c44325ff0ea10107c1c59a072b27837-90ac0eb7-9195359a";
const myDomain = "sandboxc7def4ab3503400f87511358c9960bb8.mailgun.org";
const mg = mailgun({
	apiKey: mailgunAPIKey,
	domain: myDomain,
});

const data = {
	from: "Excited User <saq9516@gmail.com>",
	to: "coolwithsaquib@gmail.com",
	subject: "Hello",
	text: "Testing some Mailgun awesomness!",
};
mg.messages().send(data, function (error, body) {
	if (error) {
		console.log("in error");
		return console.log(error);
	}
	// console.log(data)
	console.log(body);
});
