const { PrismaClient } = require("@prisma/client");

let logLevel = {
  log: ["query"],
};

if (process.env.NODE_ENV === "test") {
  logLevel = {};
}
const prisma = new PrismaClient(logLevel);

module.exports = prisma;
