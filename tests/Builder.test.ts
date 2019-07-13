import { ElementDirector, TitleBuilder } from '../src/creational'

describe('Builder', () => {

  let builder: TitleBuilder
  let director: ElementDirector

  test('Initialization', () => {
    builder = new TitleBuilder()
    expect(builder).toMatchObject({ element: '', size: 1 })

    director = new ElementDirector(builder)
    expect(director).toHaveProperty('builder')
    expect(director).toHaveProperty('makeTitle')
  })

  describe('Building', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    let spy: any

    test('Director configures', () => {
      spy = jest.spyOn(director, 'makeConfig')
      director.makeTitle('Headline')
      expect(spy).toHaveBeenCalledWith('headline')
    })

    test('Call builder steps', () => {
      spy = jest.spyOn(builder, 'addChildren')
      director.makeTitle('Headline')
      expect(spy).toHaveBeenCalledWith(
        expect.stringMatching(/headline/i)
      )
    })

    test('Finish build', () => {
      spy = jest.spyOn(builder, 'finishElement')
      director.makeTitle('Headline')
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  test('Get final product objects', () => {
    const headline = builder.getElement()
    expect(headline).toMatch(/h1 class="fancy"/)
  })

  test('Build a different configuration', () => {
    const spy = jest.spyOn(builder, 'reset')
    director.makeTitle('skiplink')
    expect(spy).toHaveBeenCalled()
    expect(builder.getElement()).toMatch(/h4 id="section"/)
    spy.mockRestore()
  })

})