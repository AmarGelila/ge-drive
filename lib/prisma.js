import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

let prisma;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient({ adapter });
} else {
	if (!global.__prisma) {
		global.__prisma = new PrismaClient({ adapter, log: ["query"] });
	}
	prisma = global.__prisma;
}

export default prisma;
