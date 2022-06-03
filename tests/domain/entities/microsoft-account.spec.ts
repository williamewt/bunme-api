import { MicrosoftAccount } from '@/domain/entities'

describe('MicrosoftAccount', () => {
  const mData = {
    name: 'any_m_name',
    email: 'any_m_email',
    microsoftId: 'any_m_id'
  }
  it('should create with facebook data only', () => {
    const sut = new MicrosoftAccount(mData)

    expect(sut).toEqual({
      name: 'any_m_name',
      email: 'any_m_email',
      microsoftId: 'any_m_id'
    })
  })

  it('should update name if its empty', () => {
    const accountData = {
      id: 'any_id'
    }

    const sut = new MicrosoftAccount(mData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_m_name',
      email: 'any_m_email',
      microsoftId: 'any_m_id'
    })
  })

  it('should not update name if its not empty', () => {
    const accountData = {
      id: 'any_id',
      name: 'any_name'
    }

    const sut = new MicrosoftAccount(mData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_m_email',
      microsoftId: 'any_m_id'
    })
  })
})
