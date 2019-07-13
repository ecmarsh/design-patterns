import { Word, Pages } from '../src/creational'

describe('Factory Method', () => {
	test('Defers to subclasses', () => {
		expect(new Word().newDoc()).toMatch(/docx/)
		expect(new Pages().newDoc()).toMatch(/pages/)
	})
})