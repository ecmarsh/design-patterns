import { installGit } from '../src/creational'

describe('Prototype', () => {
  const git = installGit('user')

  test('Example driver', () => {
    expect(git.author).toBe('user')
    expect(git.repoCnt).toEqual(2)
  })

  test('Clone via manager', () => {
    const remote = 'https://github.com/facebook/react/'
    const clone = git.clone(remote)
    expect(git.repoCnt).toEqual(3)
    expect(clone).toMatchObject({
      name: 'react',
      author: 'user',
      clone: expect.anything()
    })
  })

  test('Clones itself', () => {
    const remote = 'https://github.com/reduxjs/redux/'
    const redux = git.repos.get(remote)
    const fork = redux.clone()

    expect(fork === redux).toBe(false)

    const { name, author, files } = redux
    expect(fork).toMatchObject({ name, author, files })
  })

  test('Updating prototype no side effects', () => {
    const remote = 'https://github.com/facebook/react/'

    const reactNative = git.clone(remote)
    reactNative.name = 'react-native'
    reactNative.files.push('native.js')
    git.push(reactNative)
    expect(git.repoCnt).toEqual(4)

    const original = git.clone(remote)
    expect(original).toHaveProperty('name', 'react')
    expect(original.files).not.toContain('native.js')

    const rNative = git.clone(reactNative.remote())
    expect(rNative).toMatchObject({
      name: 'react-native',
      files: expect.arrayContaining(['native.js'])
    })
  })
})