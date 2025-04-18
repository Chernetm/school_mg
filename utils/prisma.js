const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = { prisma };

// utils/prisma.js
// import { PrismaClient } from '@prisma/client';

// const prisma = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = prisma;
// }

// export { prisma };

