import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'

const prisma = new PrismaClient()

const categoriesToSeed = [
  'Restaurant', 'Café', 'Bar', 'Park', 'Museum', 'Movie Theater',
  'Shopping Mall', 'Hotel', 'Landmark', 'Bookstore', 'Library',
  'Gym', 'Spa', 'Store', 'Bakery', 'Supermarket', 'Pharmacy',
  'University / School', 'Hospital', 'Night Club', 'Art Gallery',
  'Tourist Attraction', 'Stadium', 'Beach', 'Hiking Trail',
  'Religious Place', 'Office / Workplace'
]

async function main() {
  for (const name of categoriesToSeed) {
    const createdAt = new Date()

    await prisma.category.create({
      data: {
        id: randomUUID(),
        name: name,
        createdAt
      },
    })
    console.log(`Category '${name}' created successfully.`);
  }
  console.log(`Seed completed. ${categoriesToSeed.length} categories added.`)
}

main()
  .catch(e => {
    console.error('An error occurred during seeding:', e);
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
