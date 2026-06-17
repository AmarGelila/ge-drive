import "dotenv/config";
import express from "express";
import passport from "passport";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./lib/prisma.js";
import authRouter from "./routes/auth.js";
import mainRouter from "./routes/main.js";
import folderRouter from "./routes/folder.js";
import fileRouter from "./routes/file.js";

const app = express();
const sessionStore = new PrismaSessionStore(prisma, {
	sessionModelName: "Session",
	checkPeriod: 120000,
	dbRecordIdFunction: undefined,
	dbRecordIdIsSessionId: true,
});

app.use(express.static("public"));
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
	methodOverride((req, res) => {
		if (req.body && typeof req.body === "object" && "_method" in req.body) {
			const method = req.body._method;
			delete req.body._method;
			return method;
		}
	}),
);
app.use(
	session({
		cookie: {
			maxAge: 864000000, // 1 day
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		},
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
	}),
);
app.use(flash());

app.use(passport.session());

app.use((req, res, next) => {
	const flashErrors = req.flash("errors");
	const flashFormValues = req.flash("formValues");
	const flashErrorMessage = req.flash("errorMessage");
	res.locals.errors = flashErrors.length > 0 ? flashErrors[0] : {};
	res.locals.formValues =
		flashFormValues.length > 0 ? flashFormValues[0] : {};
	res.locals.errorMessage =
		flashErrorMessage.length > 0 ? flashErrorMessage[0] : null;
	next();
});

app.use("/", authRouter);

app.use((req, res, next) => {
	if (!req.isAuthenticated()) return res.redirect("/sign-in");
	res.locals.user = req.user;
	next();
});
app.use((req, res, next) => {
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
	next();
});
app.use("/", mainRouter);
app.use("/folder", folderRouter);
app.use("/file", fileRouter);
app.get("/error", (req, res) => res.render("error"));

app.use((err, req, res, next) => {
	console.error(err.message);
	if (err.stack) console.log(err.stack);
	if (res.headersSent) {
		return next(err);
	}

	const errorMessage = err.message || "Internal Server Error";
	const context = err.cause || {};
	const redirectRoute = context.route || "/error";
	const statusCode = context.statusCode || 500;
	const formValues = context.formValues || null;
	const errors = context.errors || null;

	req.flash("errorMessage", errorMessage);
	if (formValues) req.flash("formValues", formValues);
	if (errors) req.flash("errors", errors);

	res.status(statusCode).redirect(redirectRoute);
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
	if (err) throw err;
	console.log(`Server running at port ${port}`);
});
