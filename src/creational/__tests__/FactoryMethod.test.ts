import { Word, Pages } from '../FactoryMethod'

describe('Factory Method', () => {
  test('Defers to subclasses', () => {
    expect(new Word().newDoc()).toMatch(/docx/)
    expect(new Pages().newDoc()).toMatch(/pages/)
  })
})