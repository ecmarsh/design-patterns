import { App, DOM } from '../Template'

describe('Template Method', function testTemplateMethod() {
  let app: App

  beforeEach(() => {
    app = new App()
  })

  afterEach(() => {
    app.emitter.emit('unmount')
  })

  test('Listeners', () => {
    const listeners = app.emitter.eventNames()
    expect(listeners).toMatchObject(
      ['error', 'init', 'mount', 'update', 'unmount']
    )
  })

  test('Error', () => {
    app.emitter.emit('error', new Error('Oops!'))
    expect(DOM.body).toMatch(/oops/i)
  })

  test('Initial render', () => {
    app.emitter.emit('init')
    expect(DOM.body).toMatch(/rendered/i)
  })

  test('Mount', () => {
    app.emitter.emit('mount')
    expect(DOM.body).toMatch(/mounted/i)
  })

  test('Update', () => {
    app.emitter.emit('update')
    expect(DOM.body).toMatch(/updated/i)
  })

  test('Unmount', () => {
    app.emitter.emit('unmount')
    const listeners = app.emitter.eventNames()
    expect(listeners.length).toEqual(0)
  })
})