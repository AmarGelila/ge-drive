import prisma from "../lib/prisma.js";
async function redirectToParent(res, parentFolderId) {
	const parentFolder = await prisma.folder.findUnique({
		where: { id: +parentFolderId },
	});

	if (!parentFolder.parentFolderId) return res.redirect("/");
	res.redirect(`/folder/${parentFolderId}`);
}

export default redirectToParent;
