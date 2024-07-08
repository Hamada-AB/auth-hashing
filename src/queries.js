const prisma = require("./prisma");

const createUser = async (username, password) => {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
  });
};

const getUser = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

module.exports = { createUser, getUser };
