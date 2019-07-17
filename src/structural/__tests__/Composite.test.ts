import { File, Directory } from '../Composite'

describe('Composite', function testComposite() {
  test('Leaf initialization', () => {
    const file = new File('file', 10)
    expect(file).toMatchObject({
      name: 'file',
      size: 10,
      parent: null
    })
  })

  test('Composite initialization', () => {
    const dir = new Directory('dir', 4)
    expect(dir).toMatchObject({
      name: 'dir',
      size: 4,
      parent: null
    })
  })

  test('Add leaf to composite', () => {
    const file = new File('file', 3)
    const dir = new Directory('dir', 4)
    // Cannot add to file
    expect(() => file.add(file)).toThrow()
    // Add file to dir
    dir.add(file)
    expect(file.parent).toMatch('dir')
    // dir:4 + file:3 = 7
    expect(dir.size).toEqual(7)
  })

  test('Add composite to composite', () => {
    const file = new File('file', 2)
    const childDir = new Directory('childDir', 4)
    const parentDir = new Directory('parentDir', 4)
    childDir.add(file)
    parentDir.add(childDir)
    expect(file.parent).toBe('childDir')
    expect(childDir.parent).toBe('parentDir')
    expect(parentDir.size).toEqual(10)
  })

  test('Removing', () => {
    const fileSize2 = new File('file1', 2)
    const fileSize4 = new File('file2', 4)
    const dir = new Directory('dir', 4)
    // Cannot remove from file
    expect(() => fileSize4.remove(fileSize2)).toThrow()
    // Add files to dir
    dir.add(fileSize2)
    dir.add(fileSize4)
    // Dir size is 4+2+4=10
    expect(dir.size).toEqual(10)
    // Remove file:2 from dir:10
    dir.remove(fileSize2)
    expect(dir.size).toEqual(8)
    expect(fileSize2.parent).toBeNull()
    expect(fileSize4.parent).toEqual('dir')
  })

  test('Get child', () => {
    const file = new File('file', 6)
    const dir = new Directory('dir', 4)
    dir.add(file)
    expect(dir.getChild('file')).toBe(file)
  })

  test('Base compression', () => {
    const file = new File('file', 10)
    const dir = new Directory('dir', 4)
    file.compress()
    dir.compress()
    // compress() -> size/2 + 1
    expect(file.size).toEqual(6)
    // Should only compress child files
    expect(dir.size).toEqual(4)
  })

  test('Shallow recursion compression', () => {
    const file = new File('file', 10)
    const dir = new Directory('dir', 4)
    dir.add(file)
    dir.compress()
    expect(file.size).toEqual(6)
    // 4+10=14->compress()->4+6
    expect(dir.size).toEqual(10)
  })

  test('Deep recursion compression', () => {
    const file1 = new File('file1', 10),
      file2 = new File('file2', 10),
      childDir = new Directory('childDir', 4),
      parentDir = new Directory('parentDir', 4)

    // Structure: parent{ file1, child{ file2 } }
    childDir.add(file2)
    parentDir.add(childDir)
    parentDir.add(file1)

    expect(parentDir.size).toEqual(10 + 10 + 4 + 4)
    parentDir.compress()
    // Each nested file should compress from 10 to 6
    // See above test for check
    expect(parentDir.size).toEqual(6 + 6 + 4 + 4)
  })
})