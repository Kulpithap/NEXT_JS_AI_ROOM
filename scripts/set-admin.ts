import prisma from "../src/lib/prisma";

async function setAdmin() {
  const email = "kulpithap623@gmail.com";
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });

    console.log(`Successfully set ${email} as admin.`);
  } catch (error) {
    console.error("Error updating user role:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();
