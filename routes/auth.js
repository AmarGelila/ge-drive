import { Router } from "express";
import passport from "passport";
import { signUpValidator, signInValidator } from "../utils/validators.js";
import tryCatch from "../utils/tryCatch.js";
import { postSignUp, postSignIn, signOut } from "../controllers/auth.js";
import "../lib/passport.js";

const router = Router();

router
	.route("/sign-up")
	.get(tryCatch((req, res) => res.render("sign-up")))
	.post(signUpValidator, tryCatch(postSignUp));

router
	.route("/sign-in")
	.get(tryCatch((req, res) => res.render("sign-in")))
	.post(signInValidator, tryCatch(postSignIn));

router.get("/sign-out", tryCatch(signOut));

router.get(
	"/sign-in/google",
	tryCatch(passport.authenticate("google", { scope: ["profile", "email"] })),
);

router.get(
	"/sign-in/google/callback",
	passport.authenticate("google", { failureRedirect: "/sign-in" }),
	(req, res) => {
		res.redirect("/");
	},
);

export default router;

/*
	~sign-in						>> 		Render sign-in
	~sign-in/google					>> 		Google Authenticate
	~sign-in/google/callback		>> 		Google Authenticate
	~sign-up						>> 		Render sign-up

	~sign-in:post					>> 		Local Strategy Log In
	~sign-up:post					>> 		Local Strategy Sign Up

*/
