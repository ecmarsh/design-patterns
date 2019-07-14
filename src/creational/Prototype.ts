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
 */

// PROTOTYPE<I>
// Declares an interface for cloning itself
interface Clonable {
  clone(): this
  [key: string]: any
}

// CONCRETE PROTOTYPE
// Implements an operation for cloning itself
const repository: Clonable = {
  name: '',
  author: '',
  files: [''],
  construct(name: string, author: string, files: string[]) {
    this.name = name
    this.author = author
    this.files = files
    return this
  },
  remote() {
    return `https://github.com/${this.author}/${this.name}/`
  },
  clone() {
    const prototype = Object.create(this)
    Object.assign(prototype, this)

    // Have to deep-copy non-primitive
    // one of the considerations with cloning
    prototype.files = [...this.files]

    return prototype
  }
}


// Optional "prototype manager"
// keeps track of available prototypes
const git = {
  repos: new Map(),
  user: 'N/A',
  clone: function clone(remote: string): Clonable {
    const prototype = this.repos.get(remote).clone()
    prototype.author = this.user
    this.push(prototype)
    return prototype
  },
  push: function push(repo: Clonable) {
    this.repos.set(repo.remote(), repo)
  },
  createRepo: function createRepo({
    name,
    author,
    files = []
  }: {
    name: string,
    author: string,
    files: string[]
  }) {
    const repo = repository.construct(name, author, files)
    this.push(repo)
    return repo
  },
  install: function install(user: string) {
    this.user = user
    return this
  },
  reset: function reset() {
    this.user = 'N/A'
    this.repos = new Map()
    return this
  }
}

// Client can create a new object by asking
// a prototype to clone itself rather
// than depending on the parent class

export { git }