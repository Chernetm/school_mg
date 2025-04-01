
import { prisma } from "./prisma";

export  const getSession = async (studentID) => {
  return await prisma.studentSession.findUnique({ where: { studentID:studentID} });
};

export const saveSession = async (studentID, deviceFingerprint) => {
  return await prisma.studentSession.upsert({
    where: { studentID:studentID },
    update: { deviceFingerprint },
    create: { studentID, deviceFingerprint },
  });
};