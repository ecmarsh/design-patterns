/**
 * Chain of Responsibility
 * 
 * -----------------
 * Usage:
 * To decouple requester from receiver.
 * When more than one object may handle a request, and the handler isn't exactl known.
 * To issue a request to one of several objects.
 * When set of objects that can handle requests should be specified dynamically.
 * 
 * -----------------
 * Consequences:
 * + Reduced coupling from having to know the exact handler, thereby simplifying object interconnections and reducing necessary references.
 * + More flexibility in assigning responsibilies to objects. You can easily adjust the chain by adding/removing handlers.
 * - Receipt isn't guaranteed. Without an explicit receiver, there's no way to know for sure that it will find a handler in the chain.
 * 
 * -----------------
 * Implementation Notes:
 * Two possible ways to implement _successor chain_
 *   1. Define new links (usually in Handler, possibly Concrete Handlers)
 *   2. Use existing links. Parent refs can define successors in composites.
 * _Connecting Sucessors_: Defining the chain by giving the handler a refernce to 'next' to define the chain.
 * You can hardcode request operations or use a single handler that takes codes/request objects to identify and call corresponding handler.
 *
 */


/**
 * **Handler**
 * Defines interface for handling requests.
 * Optionally implements the successor link.
 */
interface Handler {
  handleRequest(file: string): File | Error
}

/**
 * **Concrete Handlers**
 * Handles requests it is responsible for.
 * Can access its successor.
 * Handles request if able or forwards request.
 */
class RequestHandler implements Handler {
  public static throwNotFound(target: string): Error {
    throw ReferenceError(`Cannot find module ${target}.`)
  }

  public constructor(private dir: Directory) {
    this.dir = dir
  }

  /**
   * _Handle Request Flow_
   * 1. File requests target: File.request('target')
   * 2. cwd is file parent or error
   * 3. Check cwd for node_modules/target.js. Return if found
   * 4. Check cwd for node_modules/target module. If found:
   *    a. Resolve w/ package module for `package.json` -> get main
   *        i. If `package` && `main`, check for `main` file. Return if found.
   *    b. Check for index.js. Resolve w index if exists.
   * 5. Try successor
   *    a. If cwd is root, throw 'NOT_FOUND' 
   *    a. Set cwd to cwd parent. Return to step 3
   * 6. Repeat until resolved with file or error
   */
  public handleRequest(target: string) {
    if (!('node_modules' in this.dir.entries)) {
      return this.tryNext(target)
    }

    const nodeModules = this.dir.entries['node_modules'] as Directory

    // 1. Check for file named target
    if (nodeModules.hasFile(target)) {
      return nodeModules.entries[`${target}.js`] as File
    }

    // 2. Check for dir named target
    if (nodeModules.hasDirectory(target)) {
      const targetModule = nodeModules.entries[target] as Directory
      const resolvedAsModule = this.resolveAsModule(targetModule)
      if (resolvedAsModule) {
        return resolvedAsModule
      }
    }

    return this.tryNext(target)
  }

  protected resolveAsModule(mod: Directory) {
    // Resolve with package's main file, if exists
    if (mod.hasPackage()) {
      const pkg = mod.entries['package.json'] as Package
      if (mod.hasFile(pkg.main.replace('.js', ''))) {
        return mod.entries[pkg.main] as File
      }
    }
    // Resolve with index, if exists
    if (mod.hasFile('index')) {
      return mod.entries['index.js'] as File
    }
  }

  protected tryNext(target: string): Error | File {
    if (!this.dir.parent) {
      return RequestHandler.throwNotFound(target)
    }
    this.dir = this.dir.parent
    return this.handleRequest(target)
  }
}


/**
 * _Client_
 * Initiates the request to a Concrete Handler on the chain.
 * The request propogates along the chain until
 * a handler takes responsibility and handles it.
 */

/** Represents directory entry, either file or directory */
export interface Dirent {
  dName: string
  parent?: Directory
  entries?: { [dName: string]: Dirent }
}

/**
 * Directory that may contain entries and parent.
 * Request handler wraps directory to resolve requests
 * using props/methods of the directory.
 */
export class Directory implements Dirent {
  public parent?: Directory
  public entries: { [dName: string]: Dirent }

  public constructor(public dName: string) {
    this.dName = dName
    this.entries = {}
  }

  /** Adds one or more dirents to directory entries. */
  public add(...dirents: Dirent[]): this {
    for (const dirent of dirents) {
      dirent.parent = this
      this.entries[dirent.dName] = dirent
    }
    return this
  }

  /** Removes dirent from directory entries.
   * @param {Dirent} dName The dirent to remove. 
   */
  public rm(dName: string): boolean {
    return delete this.entries[dName]
  }

  public hasDirectory(target: string): boolean {
    return this.has(target)
  }
  public hasFile(target: string): boolean {
    return this.has(`${target}.js`)
  }
  public hasPackage(): boolean {
    return this.has('package.json')
  }

  protected has(dName: string): boolean {
    return dName in this.entries
  }
}

/** The simplest directory entry. A leaf in structure.  */
export class File implements Dirent {
  public dName: string
  public parent?: Directory
  private Handler: typeof RequestHandler

  public constructor(dName: string, Handler = RequestHandler) {
    this.dName = dName
    this.Handler = Handler
  }

  /** Initializes the request for a target file. */
  public request(target: string) {
    if (!this.parent) {
      return this.Handler.throwNotFound(target)
    }
    const handler = new this.Handler(this.parent)
    return handler.handleRequest(target)
  }
}

/** Specified file indicating the "main" file for package. */
export class Package extends File {
  public main: string
  public parent?: Directory

  public constructor(main: string = 'index.js') {
    super('package.json')
    this.main = main
  }
}
