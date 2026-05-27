import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

const email = 'rohithtelidevara@gmail.com';
const password = 'Rohith@143';
const name = 'Rohith';
const role = 'ADMIN';

async function main() {
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { name, password: hashed, role },
    create: { email: email.toLowerCase(), name, password: hashed, role },
  });
  console.log('✅ Admin user created/updated');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
