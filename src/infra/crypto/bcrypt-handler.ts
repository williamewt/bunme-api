import bcrypt from 'bcrypt'

import { Hasher, HashComparer } from '@/domain/contracts/gateways'

export class BcryptHandler implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash ({ plaintext }: Hasher.Input): Promise<Hasher.Output> {
    return bcrypt.hash(plaintext, this.salt)
  }

  async compare ({ plaintext, digest }: HashComparer.Input): Promise<HashComparer.Output> {
    return bcrypt.compare(plaintext, digest)
  }
}
