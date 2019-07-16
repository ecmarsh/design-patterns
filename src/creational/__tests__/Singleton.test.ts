import { Database as Db } from '../Singleton'

beforeEach(() => {
  Db.clean()
})

afterAll(() => {
  Db.clean()
})

describe('Singleton', () => {
  test('Lazy initialization', () => {
    expect(Db.isInitialized()).toBe(false)
  })

  test('Get instance', () => {
    Db.getInstance()
    expect(Db.isInitialized()).toBe(true)
  })

  test('Cleaned before each', () => {
    expect(Db.isInitialized()).toBe(false)
  })

  test('Returns same instance, different calls', () => {
    const instance = Db.getInstance()
    expect(instance).toBeInstanceOf(Db)
    const secondInstance = Db.getInstance()
    expect(Object.is(instance, secondInstance)).toBe(true)
  })

  test('Example query', () => {
    const instance = Db.getInstance()
    expect(instance.query('users')).toEqual(
      expect.arrayContaining([expect.anything()])
    )
  })

  test('Subclassing instance equality', () => {
    class DbExt extends Db { }
    const instance = Db.getInstance()
    const extInstance = DbExt.getInstance()
    expect(extInstance).toBe(instance)
  })
})