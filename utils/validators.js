import { body } from "express-validator";
import prisma from "../lib/prisma.js";

const signUpValidator = [
	body("name").trim().notEmpty().isLength({ max: 20, min: 4 }),
	body("email")
		.trim()
		.notEmpty()
		.withMessage("An Email Address is required.")
		.isEmail()
		.withMessage("Please enter a valid email address.")
		.custom(async (email) => {
			const user = await prisma.user.findUnique({ where: { email } });
			if (user)
				throw new Error("This email already exists , Try to sign in");
			return true;
		}),
	body("password")
		.isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minSymbols: 1,
			minNumbers: 1,
		})
		.withMessage(
			"Password must be more than 8 charcters and includes caps, numbers, and symbols",
		),
	body("confirmPassword")
		.custom((value, { req }) => value === req.body.password)
		.withMessage("The password doesnot match"),
];

const signInValidator = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email Address is required.")
		.isEmail()
		.withMessage("Please enter a valid email address."),
	body("password")
		.isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minSymbols: 1,
			minNumbers: 1,
		})
		.withMessage(
			"Password must be more than 8 charcters and includes caps, numbers, and symbols",
		),
];

const newFolderSanitizer = [
	body("newFolder")
		.trim()
		.notEmpty()
		.withMessage("Please enter a name for the new folder")
		.escape(),
	body("parentFolderId").toInt(),
];
export { signUpValidator, signInValidator, newFolderSanitizer };
