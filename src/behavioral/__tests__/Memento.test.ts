import { Git, File } from '../Memento'


describe('Memento', function testMemento() {
  test('Init', () => {
    const file = new File()
    expect(file).toHaveProperty('state', {
      name: expect.stringMatching(/untitled/i),
      text: '',
      sizeBytes: 1
    })

    const git = Git.init(file)
    expect(git).toHaveProperty('originator')
  })

  test('Edit file', () => {
    const file = new File()
    file.rename('new.txt')
    file.addText('hello, world')

    expect(file).toHaveProperty('state', {
      name: 'new.txt',
      text: 'hello, world',
      sizeBytes: 13
    })
  })

  test('Commit and get commit with id', () => {
    const file = new File('index.js', 'hello, world')
    const git = Git.init(file)
    const commitId = git.commit()
    const commit = git.checkout(commitId)
    expect(commit).toMatchObject(file)
  })

  test('Log', () => {
    const file = new File()
    const git = Git.init(file)
    git.commit() // 1
    file.rename('new.txt')
    git.commit() // 2
    expect(git.log()).toHaveLength(2)
  })

  test('Restore memento - "Rebase"', () => {
    const file = new File('first.txt', 'hello')
    const git = Git.init(file)
    const initialCommit = git.commit()
    file.rename('second.txt')
    file.addText(', world')
    git.commit()

    // At this point we should have two
    // commits, and the file should be
    // up to date with latest commit.
    expect(file).toHaveProperty('state', {
      name: 'second.txt',
      text: 'hello, world',
      sizeBytes: 13
    })

    // Rebase - restore the previous "state"
    // And the file should be the first commit
    git.rebase(initialCommit)
    expect(file).toHaveProperty('state', {
      name: 'first.txt',
      text: 'hello',
      sizeBytes: 6
    })
  })
})