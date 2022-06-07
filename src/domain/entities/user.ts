export type User = {
  id: bigint
  name?: string | null
  email: string
  password?: string | null
  facebookId?: string | null
  googleId?: string | null
  microsoftId?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
}
