import { Dirent, Directory, File, Package } from '../ChainResp'

describe('Chain Resp. Helper Objects', function testChainRespUtils() {
  test('File initialization', () => {
    const file = new File('filename')
    expect(file.dName).toMatch('filename')
    expect(file.parent).toBeFalsy()
  })

  test('Package file', () => {
    const pkg = new Package('index.js')
    expect(pkg).toBeInstanceOf(File)
    expect(pkg.dName).toMatch('package.json')
    expect(pkg.main).toMatch('index.js')
  })

  test('Directory initialization', () => {
    const dir = new Directory('dirname')
    expect(dir.dName).toMatch('dirname')
    expect(dir.entries).toMatchObject({})
  })

  test('Add file to directory', () => {
    const dir = new Directory('dirname'),
      filename = 'filename',
      file = new File(filename)

    const addFile = () => dir.add(file)
    // Should return dir for chaining methods
    expect(addFile()).toBe(dir)
    // Dir should be parent of file, and file child of dir
    expect(file.parent).toBe(dir)
    expect(dir.entries).toHaveProperty(filename)
  })

  test('Add directory to directory', () => {
    const parent = new Directory('parent')
    const child = new Directory('child')
    parent.add(child)
    expect(child.parent).toBe(parent)
    expect(parent.entries).toHaveProperty('child')
  })

  test('Add multiple in one call', () => {
    const dir = new Directory('dir')
    const entries: Dirent[] = ['f1', 'f2', 'f3'].map(fname => new File(fname))
    dir.add(...entries)
    expect(Object.entries(dir.entries)).toHaveLength(3)
  })

  test('Directory with multiple levels', () => {
    const parent = new Directory('parent'),
      child = new Directory('child'),
      file = new File('file')

    parent.add(child.add(file))
    expect(parent.entries['child']).toBeTruthy()
    expect(child.entries['file']).toBeTruthy()
  })

  describe('Directory hasDirent()', () => {
    let dir: Directory
    beforeEach(() => {
      dir = new Directory('dir')
    })

    test('hasDirectory()', () => {
      const childDirname = 'childDir'
      expect(dir.hasDirectory(childDirname)).toBe(false)
      dir.add(new Directory(childDirname))
      expect(dir.hasDirectory(childDirname)).toBe(true)
    })
    test('hasFile()', () => {
      const index = 'index'
      expect(dir.hasFile(index)).toBe(false)
      dir.add(new File(`${index}.js`))
      expect(dir.hasFile(index)).toBe(true)
    })
    test('hasPackage()', () => {
      expect(dir.hasPackage()).toBe(false)
      dir.add(new Package())
      expect(dir.hasPackage()).toBe(true)
    })
  })

  test('Remove dirent from directory', () => {
    const parent = new Directory('parent')
    const childDir = new Directory('childDir')
    const childFile = new File('childFile.js')
    parent.add(childDir, childFile)
    const hasDir = () => parent.hasDirectory('childDir')
    const hasFile = () => parent.hasFile('childFile')

    expect(hasDir()).toBe(true)
    expect(hasFile()).toBe(true)
    // Remove file
    parent.rm(childFile.dName)
    expect(hasFile()).toBe(false)
    expect(hasDir()).toBe(true) // Ensure no side effects
    // Remove directory
    parent.rm(childDir.dName)
    expect(hasDir()).toBe(false)
  })
})

describe('Chain of Resp. Handling', function testChainHandlers() {
  test('Request from file without parent throws', () => {
    const file = new File('filename')
    const makeRequest = () => file.request('target')
    expect(makeRequest).toThrow()
  })

  test('Simple resolve as file', () => {
    const dir = new Directory('dir'),
      nodeModules = new Directory('node_modules'),
      requester = new File('requester.js'),
      targetFile = new File('target.js')

    dir.add(requester, nodeModules)
    nodeModules.add(targetFile)

    /*
    |- /dir
    |   |
    |   | requester.js
    |   |
    |   |- /node_modules
    |       |
    |       | target.js
    |
    */

    const requested = requester.request('target')
    expect(requested).toBe(targetFile)
  })

  describe('Resolve as module', function testResolveAsMod() {
    test('Resolve with package.main', () => {
      const dir = new Directory('dir'),
        nodeModules = new Directory('node_modules'),
        targetDir = new Directory('target'),
        pkg = new Package('main.js'),
        main = new File('main.js'),
        requester = new File('requester.js')

      dir.add(requester, nodeModules.add(targetDir.add(pkg, main)))

      /*
      |- /dir
      |   |
      |   | requester.js
      |   |
      |   |- /node_modules
      |        |
      |        |- /target
      |            | main.js
      |            | package.json
      |
      */

      const requested = requester.request('target')
      expect(requested).toBe(main)
    })

    test('Resolve with index', () => {
      const dir = new Directory('dir'),
        nodeModules = new Directory('node_modules'),
        targetDir = new Directory('target'),
        index = new File('index.js'),
        requester = new File('requester.js')

      dir.add(requester, nodeModules.add(targetDir.add(index)))

      /*
      |- /dir
      |   |
      |   | requester.js
      |   |
      |   |- /node_modules
      |        |
      |        |- /target
      |        |   |
      |            | index.js
      |
      */

      const requested = requester.request('target')
      expect(requested).toBe(index)
    })
  })

  test('Resolves in next', () => {
    const root = new Directory('root'),
      src = new Directory('src'),
      nodeModules = new Directory('node_modules'),
      target = new File('target.js'),
      requester = new File('requester.js')

    root.add(src.add(requester), nodeModules.add(target))

    /*
    |- /root
    |   |
    |   |- /src
    |   |    |
    |   |    | requester.js
    |   |
    |   |- /node_modules
    |        |
    |        | target.js
    |
    */

    const requested = requester.request('target')
    expect(requested).toBe(target)
  })

  test('Multiple-level traversal', () => {
    const rootDir = new Directory('root'),
      nodeModulesRoot = new Directory('node_modules'),
      targetDir = new Directory('target'),
      index = new File('index.js'),
      midDir = new Directory('mid'),
      nodeModulesMid = new Directory('node_modules'),
      notTarget = new File('notTarget.js'),
      lowDir = new Directory('low'),
      requester = new File('requester.js')

    rootDir.add(
      midDir.add(
        nodeModulesMid.add(
          notTarget
        ),
        lowDir.add(
          requester
        )
      ),
      nodeModulesRoot.add(
        targetDir.add(
          index
        )
      )
    )

    /*
    |- /rootDir
    |   |
    |   |- /mid
    |   |    |
    |   |    |- /node_modules
    |   |    |   | 
    |   |    |   | notTarget.js 
    |   |    | 
    |   |    |- /low
    |   |    |   |
    |   |    |   | requester.js <--initiates
    |   |
    |   |- /node_modules
    |        |
    |        |- /target
    |            |
    |            | index.js  <--expected
    |
    */

    const requested = requester.request('target')
    expect(requested).toBe(index)
  })

  describe('Chain order', () => {
    const root = new Directory('root'),
      src = new Directory('src'),
      requester = new File('requester.js'),
      nodeModules = new Directory('node_modules'),
      targetFile = new File('target.js'),
      targetDir = new Directory('target'),
      pkg = new Package('main.js'),
      main = new File('main.js'),
      index = new File('index.js')

    root.add(
      src.add(requester),
      nodeModules.add(
        targetFile,
        targetDir.add(main, pkg, index)
      )
    )

    const makeRequest = () => requester.request('target')

    /* Initial structure (number is delete order)
    |- /root
    |   |
    |   |- /src
    |   |    |
    |   |    | requester.js
    |   |
    |   |- /node_modules (6) -> throw
    |        |
    |        | target.js (1)
    |        |
    |        |- /target (5) -> throw
    |        |    |
    |        |    | main.js (2)
    |        |    | package.json (3)
    |        |    | index.js (4) -> throw
    |
    */

    test('0. Resolves with target file', () => {
      const requested = makeRequest()
      expect(requested).toBe(targetFile)
    })
    test('1. Resolves with pkg main if no file', () => {
      nodeModules.rm(targetFile.dName)
      const requested = makeRequest()
      expect(requested).toBe(main)
    })
    test('2. Resolves with index if pkg, but no main', () => {
      targetDir.rm(main.dName)
      const requested = makeRequest()
      expect(requested).toBe(index)
    })
    test('3. Resolves with index if no pkg', () => {
      targetDir.rm(pkg.dName)
      const requested = makeRequest()
      expect(requested).toBe(index)
    })
    test('4. Throws if target module, but no pkg, main, or idx', () => {
      targetDir.rm(index.dName)
      expect(makeRequest).toThrow()
    })
    test('5. Throws if node_modules, no target module', () => {
      nodeModules.rm(targetDir.dName)
      expect(makeRequest).toThrow()
    })
    test('6. Throws if no node_modules in root structure', () => {
      root.rm(nodeModules.dName)
      expect(makeRequest).toThrow()
    })
  })
})
