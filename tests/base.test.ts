describe('Base tests', () => {

	test('Simple equality', () => {
		expect(1 + 2).toEqual(3)
		expect(false).not.toBe(true)
		expect(null).toBeNull()
	})

	test('Mocks', () => {
		const Person: any = {
			init(name: string) {
				this.name = name
			},
			fetch() {
				return new Promise(res => {
					setTimeout(() => res(this.name), 0)
				})
			},
		}

		const john = Object.create(Person)
		john.init('John')
		john.fetch().then((name: string) =>
			expect(name).toMatch(/John/))

		john.fetch = jest.fn().mockResolvedValue('Bob')
		john.fetch().then((name: string) =>
			expect(name).toMatch(/Bob/))
	})
})