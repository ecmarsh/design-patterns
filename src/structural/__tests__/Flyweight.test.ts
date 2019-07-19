import { FlyweightFactory } from '../Flyweight'

const factory = FlyweightFactory.createInstance()

beforeEach(() => {
  setupFactory()
})

afterEach(() => {
  resetFactory()
})


describe('Flyweight', function testFlyweight() {

  test('Flyweight Factory', () => {
    expect(factory).toBeTruthy()
  })

})

function setupFactory() {
  // Add flyweights?
}

function resetFactory() {
  factory.clear()
}