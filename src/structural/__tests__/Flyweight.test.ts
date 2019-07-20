import { FlyweightFactory, YellowPages, Phone, ServicePhone } from '../Flyweight'

const factory = FlyweightFactory.createTestable()
const yellowPages = YellowPages.createTestable()

afterEach(() => {
  factory.clear()
  yellowPages.clear()
})

describe('Flyweight', function testFlyweight() {
  test('Flyweight Factory', () => {
    expect(factory).toBeTruthy()
  })

  test('Create phone', () => {
    const phone = new Phone('4151234567')
    expect(phone.tel).toMatch('1234567')
    // Should have registered the phone number
    expect(yellowPages.getCount()).toEqual(1)
    // Should have created flyweight for area code
    expect(factory.getCount()).toEqual(1)
  })

  test('Phone call', () => {
    const phone = new Phone('4151234567')
    expect(phone.call()).toMatch('+14151234567')
  })

  test('Flyweight savings of area code', () => {
    const phone1 = new Phone('4151234567')
    const phone2 = new Phone('4157654321')
    // Two phones should be registered
    expect(yellowPages.getCount()).toEqual(2)
    // But they should be using the same flyweight areacode
    expect(factory.getCount()).toEqual(1)
  })

  test('Flyweight savings of shared call method', () => {
    const phone1 = new Phone('4151234567')
    const phone2 = new Phone('4157654321')
    expect(phone1 === phone2).toBe(false)
    expect(phone1.call === phone2.call).toBe(true)
  })

  test('Unshared flyweight', () => {
    const unshared = new ServicePhone('911')
    expect(unshared.call()).toMatch('911')
  })
})
