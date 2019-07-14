import { git } from '../src/creational'

let remote: string

beforeEach(() => setupGit())
afterEach(() => resetGit())


describe('Prototype', () => {

  test('Setup', () => {
    expect(git.user).toBe('user')
    expect(git.repos.has(remote)).toBe(true)
  })

  test('Manager does cloning', () => {
    const clone = git.clone(remote)
    expect(Object.is(clone, remote)).toBe(false)
    expect(clone).toMatchObject({
      name: 'react',
      author: 'user',
      clone: expect.anything() // Implements clonable
    })
  })


  test('Repo clones itself', () => {
    const repo = git.repos.get(remote)
    const clone = repo.clone()

    // Should be different refs
    expect(clone === repo).toBe(false)

    // But primitive props should be equal
    const { name, author, files } = repo
    expect(clone).toMatchObject({ name, author, files })
  })


  test('Updating prototype no side effects', () => {
    const update = git.clone(remote)

    // Make some changes to clone
    update.name = 'react-native'
    update.files.push('native.js')

    // Update the prototype mgr registry
    git.push(update)

    // Changes should persist from remote
    const updateFromRemote = git.clone(update.remote())
    expect(updateFromRemote).toMatchObject({
      name: 'react-native',
      files: expect.arrayContaining(['native.js'])
    })

    // Original should be unchanged
    const original = git.clone(remote)
    expect(original).toHaveProperty('name', 'react')
    expect(original.files).not.toContain('native.js')
  })

})


/* Setup and Teardown */

function setupGit() {
  git.install('user')
  const repo = git.createRepo({
    name: 'react',
    author: 'facebook',
    files: ['index.js', 'hooks.js', 'docs'],
  })
  remote = repo.remote()
}

function resetGit() {
  git.reset()
}