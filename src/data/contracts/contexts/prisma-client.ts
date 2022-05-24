import { PrismaClient } from '@prisma/client'
import { DeepMockProxy } from 'jest-mock-extended'

export namespace PrismaClientContext {

  export type Context = {
    prisma: PrismaClient
  }

  export type MockContext = {
    prisma: DeepMockProxy<PrismaClient>
  }
}
