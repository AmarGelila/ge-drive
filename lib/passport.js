import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import prisma from "./prisma.js";
import bcrypt from "bcryptjs";

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECERT,
			callbackURL: "/sign-in/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			const { name, email } = profile._json;
			try {
				let user = await prisma.user.findUnique({ where: { email } });
				if (!user) {
					user = await prisma.user.create({ data: { email, name } });
					await prisma.folder.create({
						data: {
							name: "root",
							parentFolderId: null,
							userId: user.id,
						},
					});
				}
				done(null, user);
			} catch (error) {
				done(error, null);
			}
		},
	),
);

passport.use(
	new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				const err = new Error("Invalid Credntials", {
					cause: {
						errors: {
							email: "This email does not exist , sign up",
						},
						formValues: {
							email,
						},
						statusCode: 400,
						route: "/sign-in",
					},
				});
				return done(err);
			}

			if (!user.password) {
				const err = new Error("Invalid Credntials", {
					cause: {
						errors: {
							email: "This is an Google Account email , Try to sign in with google below",
						},
						statusCode: 400,
						route: "/sign-in",
					},
				});
				return done(err);
			}

			const isMatched = await bcrypt.compare(password, user.password);
			if (!isMatched) {
				const err = new Error("Invalid Credntials", {
					cause: {
						errors: {
							password: "Incorrect Password",
						},
						formValues: {
							email,
						},
						statusCode: 400,
						route: "/sign-in",
					},
				});
				return done(err);
			}

			return done(null, user);
		},
	),
);

passport.serializeUser((user, done) => {
	done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		done(null, user);
	} catch (error) {
		done(error);
	}
});
