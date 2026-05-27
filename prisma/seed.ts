import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = 'admin@raagaartspace.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Raaga Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`Created admin user: ${admin.email}`);
  } else {
    console.log('Admin user already exists.');
  }

  // Seed default artworks
  const artworks = [
    {
      title: 'Shiva Canvas Art',
      description: 'A stunning minimalist representation of Lord Shiva, capturing peaceful energy and cosmic stillness. Painted with beige, sand, and sage green tones to bring a sense of spiritual calm into your space.',
      price: 799.0,
      category: 'Spiritual',
      imageUrl: '/images/shiva_canvas_art.png',
      stock: 10,
      dimensions: '18x24 inches',
    },
    {
      title: 'Sacred Mandala',
      description: 'An elegant, symmetrical mandala piece featuring intricate patterns that invite mindfulness and meditative focus. Crafted with smooth organic textures and modern metallic gold accents.',
      price: 1299.0,
      category: 'Mandala',
      imageUrl: '/images/mandala_art.png',
      stock: 5,
      dimensions: '12x12 inches',
    },
    {
      title: 'Lotus Harmony Zen Painting',
      description: 'A peaceful zen landscape drawing featuring a blooming lotus flower. The calming backdrop of soft olive, gray, and warm beige watercolor washes creates an immediate sanctuary of quiet contemplation.',
      price: 1599.0,
      category: 'Zen',
      imageUrl: '/images/spiritual_painting.png',
      stock: 8,
      dimensions: '24x30 inches',
    },
    {
      title: 'Mindful Meditation Line Art',
      description: 'A contemporary single-line drawing of a meditating figure, surrounded by soft organic earth-toned shapes. Perfect minimalist wall decor for yoga studios, bedrooms, or modern homes.',
      price: 499.0,
      category: 'Minimalist',
      imageUrl: '/images/minimal_line_art.png',
      stock: 15,
      dimensions: '16x20 inches',
    },
  ];

  for (const artwork of artworks) {
    const existing = await prisma.artwork.findFirst({
      where: { title: artwork.title },
    });

    if (!existing) {
      const created = await prisma.artwork.create({
        data: artwork,
      });
      console.log(`Seeded artwork: ${created.title}`);
    } else {
      console.log(`Artwork already exists: ${artwork.title}`);
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
