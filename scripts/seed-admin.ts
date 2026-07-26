import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { generateIdFromEntropySize } from 'better-auth/crypto'
import * as argon2 from 'argon2'

async function seedAdmin() {
  try {
    console.log('Seeding admin user...')

    const hashedPassword = await argon2.hash('billie4Kt$')
    const adminId = generateIdFromEntropySize(16)

    await db.insert(user).values({
      id: adminId,
      name: 'Admin',
      email: 'admin',
      emailVerified: true,
      isAdmin: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('Admin user seeded successfully')
    console.log('Email: admin')
    console.log('Password: billie4Kt$')
  } catch (error) {
    console.error('Error seeding admin user:', error)
    process.exit(1)
  }
}

seedAdmin()
