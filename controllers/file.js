import redirectToParent from "../utils/redirectToParent.js";
import prisma from "../lib/prisma.js";
import supabase from "../lib/supabase.js";

async function postUploadFile(req, res) {
	const userId = req.user.id;
	const { parentFolderId } = req.params;
	const { originalname, mimetype, encoding, size, buffer } = req.file;
	const fileName = `${Date.now()}_${originalname}`;

	const { data: uploadData } = await supabase.storage
		.from("Files")
		.upload(fileName, buffer);

	await prisma.file.create({
		data: {
			name: originalname,
			supabaseName: fileName,
			size,
			mimetype,
			encoding,
			userId,
			parentFolderId: Number(parentFolderId),
		},
	});

	redirectToParent(res, parentFolderId);
}

async function GetFile(req, res) {
	const { fileId } = req.params;
	const file = await prisma.file.findUnique({
		where: { id: Number(fileId) },
	});
	if (!file) {
		throw new Error("File Not Found", {
			cause: {
				statusCode: 404,
				route: "/error",
			},
		});
	}
	res.render("file", { file });
}

async function postDownloadFile(req, res) {
	const { fileId, supabaseName } = req.params;
	const { data } = await supabase.storage
		.from("Files")
		.download(supabaseName);
	const arrayBuffer = await data.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	res.setHeader("Content-Type", data.type || "application/octet-stream");
	res.setHeader(
		"Content-Disposition",
		`attachment; filename="${supabaseName}"`,
	);
	return res.send(buffer);
}

export { GetFile, postUploadFile, postDownloadFile };
