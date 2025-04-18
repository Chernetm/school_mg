// lib/prisma.js
const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    global.prisma = prisma;
  } else {
    prisma = global.prisma;
  }
}

module.exports = { prisma };

// utils/prisma.js
// import { PrismaClient } from '@prisma/client';

// const prisma = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = prisma;
// }

// export { prisma };

