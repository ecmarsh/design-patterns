describe('Base tests', () => {

	describe('Simple equality', () => {
		test('Equals', () => {
			expect(1 + 2).toEqual(3)
		})
		test('Not to be', () => {
			expect(false).not.toBe(true)
		})
		test('Null', () => {
			expect(null).toBeNull()
		})
		test('"Bool"-sy', () => {
			expect('').toBeFalsy()
			expect({}).toBeTruthy()
			expect(undefined).not.toBeNull()
		})
	})

	describe('Object equality', () => {
		const o1 = {
			color: 'blue',
			sizes: [1, 2, 3],
		}

		test('Identity', () => {
			expect(o1 === o1).toBe(true)
			expect(o1).toMatchObject(o1)
		})

		test('Copies', () => {
			const o2 = Object.assign({}, o1)
			expect(o1 == o2).toBe(false)
			expect(o2).toMatchObject(o1)
		})

		test('Nested non-primitive', () => {
			const o3 = {
				...o1,
				sizes: [1, 2, 3],
			}
			expect(o1.sizes == o3.sizes).toBe(false)
			expect(o3).toMatchObject(o1)
		})

		test('Extra properties', () => {
			const o4 = {
				...o1,
				extras: true
			}
			expect(o4).toMatchObject(o1)
		})

		test('Missing properties', () => {
			const o6 = { ...o1 }
			delete o6.sizes
			expect(o6).not.toMatchObject(o1)
		})
	})

	describe('Mocks', () => {
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

		test('Lexical 1', () => {
			john.fetch().then((name: string) =>
				expect(name).toMatch(/John/))
		})

		test('Applied mock', () => {
			john.fetch = jest.fn().mockResolvedValue('Bob')
			john.fetch().then((name: string) =>
				expect(name).toMatch(/Bob/))
		})

		test('Lexical 2', () => {
			john.fetch().then((name: string) =>
				expect(name).not.toMatch(/John/))
		})
	})
})