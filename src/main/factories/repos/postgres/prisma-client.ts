import { PrismaClient } from '@prisma/client'

export const makePrismaClient = (): PrismaClient => {
  return new PrismaClient()
}
