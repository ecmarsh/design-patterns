import { Workspace, PyFactory, JSFactory } from '../src/creational'


describe('Abstract Factory', () => {
  let jsWorkspace: Workspace
  let pyWorkspace: Workspace

  test('Initialization', () => {
    jsWorkspace = new Workspace(new JSFactory())
    pyWorkspace = new Workspace(new PyFactory())

    const expectPropsIn = (__Workspace: Workspace) => {
      const factoryProps = ['factory', 'entry', 'command', 'req']
      factoryProps.forEach(prop => expect(__Workspace).toHaveProperty(prop))
    }

    expectPropsIn(jsWorkspace)
    expectPropsIn(pyWorkspace)
  })

  test('Created products specific to factory', () => {
    expect(jsWorkspace.createEntry())
      .toMatchObject({
        fileName: 'index.js'
      })
    expect(pyWorkspace.createEntry())
      .toMatchObject({
        fileName: 'app.py'
      })

    expect(jsWorkspace.createReq())
      .toMatchObject({
        file: 'package.json'
      })
    expect(pyWorkspace.createReq())
      .toMatchObject({
        file: 'requirements.txt'
      })
  })

  test('Install', () => {
    expect(jsWorkspace.install()).toMatch('npm install')
    expect(pyWorkspace.install()).toMatch('pip -r install requirements.txt')
  })

  test('Run', () => {
    expect(jsWorkspace.run()).toMatch('node index.js')
    expect(pyWorkspace.run()).toMatch('python app.py')
  })
})