
import nodemailer from "nodemailer"


	export const transporter = nodemailer.createTransport({
		host: "smtp-relay.brevo.com",
		port: 587, // Use 465 for SSL or 587 for TLS
        secure: false, // Set to true for port 465
		auth: {
			user: "816128001@smtp-brevo.com",
			pass: "gY2aRCZIwzd4Q6kB",
		},
	});

    export const sender = "kiplangatsang08@gmail.com"

