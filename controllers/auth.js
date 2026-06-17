import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import passport from "passport";

async function postSignUp(req, res) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const { name, email } = req.body;
		throw new Error("Invalid Credentials", {
			cause: {
				formValues: { name, email },
				errors: errors.mapped(),
				statusCode: 400,
				route: "/sign-up",
			},
		});
	}

	const { name, email, password } = matchedData(req);
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: { name, email, password: hashedPassword },
	});
	await prisma.folder.create({
		data: {
			name: "root",
			parentFolderId: null,
			userId: user.id,
		},
	});
	res.redirect("/sign-in");
}

async function postSignIn(req, res, next) {
	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.status(401).redirect("/sign-in");
		req.logIn(user, (loginErr) => {
			return res.redirect("/");
		});
	})(req, res, next);
}

async function signOut(req, res) {
	req.logOut(() => {
		req.session.destroy();
		res.clearCookie("connect.sid");
		res.redirect("/sign-in");
	});
}
export { postSignUp, postSignIn, signOut };
