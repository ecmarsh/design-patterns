import { Workspace, PyFactory, JSFactory } from '../src/creational'


describe('Abstract Factory', () => {
  let jsWorkspace: Workspace
  let pyWorkspace: Workspace

  test('Initialization', () => {
    const workspaces = [jsWorkspace, pyWorkspace,]
      = [new Workspace(new JSFactory()), new Workspace(new PyFactory()),]

    workspaces.forEach(workspace => {
      for (const prop of ['entry', 'command', 'req']) {
        expect(workspace).toHaveProperty(prop)
      }
    })
  })

  test('Creates products specific to factory', () => {
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
    expect(pyWorkspace.install()).toMatch(/^pip.+requirements.txt$/)
  })

  test('Run', () => {
    expect(jsWorkspace.run()).toMatch('node index.js')
    expect(pyWorkspace.run()).toMatch('python app.py')
  })
})