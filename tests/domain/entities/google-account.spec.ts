import { GoogleAccount } from '@/domain/entities'

describe('GoogleAccount', () => {
  const gData = {
    name: 'any_g_name',
    email: 'any_g_email',
    googleId: 'any_g_id'
  }
  it('should create with facebook data only', () => {
    const sut = new GoogleAccount(gData)

    expect(sut).toEqual({
      name: 'any_g_name',
      email: 'any_g_email',
      googleId: 'any_g_id'
    })
  })

  it('should update name if its empty', () => {
    const accountData = {
      id: 'any_id'
    }

    const sut = new GoogleAccount(gData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_g_name',
      email: 'any_g_email',
      googleId: 'any_g_id'
    })
  })

  it('should not update name if its not empty', () => {
    const accountData = {
      id: 'any_id',
      name: 'any_name'
    }

    const sut = new GoogleAccount(gData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_g_email',
      googleId: 'any_g_id'
    })
  })
})
