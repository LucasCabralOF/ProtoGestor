const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  try {
    const sessions = await prisma.session.findMany({ take: 10 });
    console.log("Sessions found:", sessions.length);
    sessions.forEach(s => {
       console.log("Session ID:", s.id);
       console.log("Session data type:", typeof s.sessionData); // better-auth v1 uses session data?
    });
    
    const users = await prisma.user.findMany({ take: 5 });
    console.log("Users found:", users.length);
  } catch (e) {
    console.error("DB check failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
