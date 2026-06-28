import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

const adapter = new PrismaNeon(pool);

let prisma;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient({ adapter });
} else {
	// Prevent multiple instances during hot reload in development
	if (!global.__prisma) {
		global.__prisma = new PrismaClient({ adapter, log: ["query"] });
	}
	prisma = global.__prisma;
}

export default prisma;
