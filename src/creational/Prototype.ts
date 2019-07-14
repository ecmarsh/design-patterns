/**
 * PROTOTYPE
 *
 * ----------
 * Usage:
 * when the classes to instantiate are specified at runtime, such as by dynamic loading
 * to avoid building a duplicate class hierarchy of factories the same as the class hierarchy of products
 * when instances of a class only have a few configurations of state and it is more convenient to hard-code the configurations rather than instiating the class each time w/ appropriate state
 *
 * ----------
 * Consequences:
 * + Ability to add/remove products at run-time
 * + Specifying new objects by varying values or structure
 * + Reduced subclassing - can rely on objects themselves to clone
 * + Ability to configure your app with classes dynamically (if cannot access dynamically loaded class at runtime)
 * - Implementation difficult if sealed objects or circular references & shallow/deep implementations
 *
 *
 * Consider using a prototype manager (an associative store)
 * to keep a registry of the available prototypes if # of
 * prototypes in a system isn't fixed.
 *
 * Note: in JS - this is cake. Plenty of methods,
 * most accurately Object.create(objectToCopyPrototpeOf)
 * Shouldn't use classes - creates tight bounds
 * via the constructor. Stick to native prototypal in vanillaJS
 */

// PROTOTYPE<I>
// Declares an interface for cloning itself
interface Clonable {
  clone(): this
}

// CONCRETE PROTOTYPE
// Implements an operation for cloning itself
class Repo implements Clonable {
  constructor(
    public name: string,
    public author: string,
    public files: string[],
  ) { }

  clone = () =>
    new Repo(this.name, this.author, [...this.files]) as this

  remote = () =>
    `https://github.com/${this.author}/${this.name}/`
}

// Optional "prototype manager"
// keeps track of available prototypes
const git = {
  repos: new Map(),
  repoCnt: 0,
  clone: function clone(remote: string): Repo {
    const prototype = this.repos.get(remote).clone()
    prototype.author = this.author
    this.register(prototype)
    return prototype
  },
  register: function register(repo: Repo) {
    this.repos.set(repo.remote(), repo)
    this.repoCnt++
  },
  push: function push(repo: Repo) {
    this.repoCnt--
    this.register(repo)
  },
  author: 'N/A',
  setAuthor: function setAuthor(author: string) {
    this.author = author
  }
}

// Client
// Can create a new object by asking
// a prototype to clone itself rather
// than depending on the parent class
function installGit(author: string) {
  const react = new Repo(
    'react',
    'facebook',
    ['index.js', 'hooks.js', 'docs'],
  )
  const redux = new Repo(
    'redux',
    'reduxjs',
    ['docs', 'logo.png', 'store.js']
  )

  git.register(react)
  git.register(redux)

  git.setAuthor(author)

  return git
}

// Give git to tests
export { installGit }