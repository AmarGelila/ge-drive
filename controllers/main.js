import prisma from "../lib/prisma.js";
async function getMain(req, res) {
	const rootFolder = await prisma.folder.findFirst({
		where: { parentFolderId: null, userId: req.user.id },
	});

	const subFolders = await prisma.folder.findMany({
		where: { parentFolderId: rootFolder.id },
	});

	const files = await prisma.file.findMany({
		where: { parentFolderId: rootFolder.id },
	});
	res.render("folder", { subFolders, files, folder: rootFolder });
}

export { getMain };
