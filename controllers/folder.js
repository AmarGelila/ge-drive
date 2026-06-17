import prisma from "../lib/prisma.js";
import redirectToParent from "../utils/redirectToParent.js";

async function getFolder(req, res) {
	const { folderId } = req.params;
	const folder = await prisma.folder.findUnique({
		where: { id: +folderId },
	});

	if (!folder) {
		throw new Error("Folder Not Found", {
			cause: {
				statusCode: 404,
				route: "/error",
			},
		});
	}

	const subFolders = await prisma.folder.findMany({
		where: { parentFolderId: +folderId },
	});

	const files = await prisma.file.findMany({
		where: { parentFolderId: +folderId },
	});

	res.render("folder", { folder, subFolders, files });
}

async function postNewFolder(req, res) {
	const { newFolder: name } = req.body;
	const { parentFolderId } = req.params;
	const userId = req.user.id;

	await prisma.folder.create({
		data: { name, parentFolderId: +parentFolderId, userId },
	});

	redirectToParent(res, parentFolderId);
}

async function deleteFolder(req, res) {
	const { parentFolderId, folderId } = req.params;
	await prisma.folder.delete({ where: { id: +folderId } });
	redirectToParent(res, parentFolderId);
}

export { postNewFolder, getFolder, deleteFolder };
