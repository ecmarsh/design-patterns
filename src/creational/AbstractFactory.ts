/**
 * Abstract Factory (Kit)
 *
 * --------------
 * Usage:
 * when a system should be independent of how its products are created, composed, and represented.
 * when a system should be configured with one of multiple families of products.
 * to enforce using a family of related product objects together.
 * to provide a class library of products, revealing only their interfaces.
 *
 * -------------
 * Consequences:
 * + Isolates concrete classes
 * + Facilitates exchanging product families
 * + Promotes consistency among products
 * - Adding new products is difficult (in static languages).
 *
 */


/**
 * **Abstract Factory:**
 * Declares an interface for operations
 * that create abstract product objects.
 */
interface WorkspaceFactory {
  command: Command
  createEntry(): Entry
  createReq(): Req
}


/**
 * **Concrete Factories:**
 * Implements operations to create
 * concrete product objects.
 */
class JSFactory implements WorkspaceFactory {
  public command: Command = new JSCommand()
  public createEntry = (): Entry => new JSEntry()
  public createReq = (): Req => new JSReq()
}

class PyFactory implements WorkspaceFactory {
  public command: Command = new PyCommand()
  public createEntry = (): Entry => new PyEntry()
  public createReq = (): Req => new PyReq()
}


/**
 * **Abstract Products:**
 * Declares interface for
 * a type of product object.
 */
interface Req {
  file: string
  mgr: string
}

interface Entry {
  fileName: string
}

interface Command {
  install: string
  run: string
}


/**
 * **Concrete Products:**
 * Defines a product object to be created
 * by the corresponding concrete factory.
 */
class JSReq implements Req {
  public file = 'package.json'
  public mgr = 'npm'
}

class PyReq implements Req {
  public file = 'requirements.txt'
  public mgr = 'pip'
}

class JSEntry implements Entry {
  public fileName = 'index.js'
}

class PyEntry implements Entry {
  public fileName = 'app.py'
}

class JSCommand implements Command {
  public install = 'install'
  public run = 'node'
}

class PyCommand implements Command {
  public install = '-r install requirements.txt'
  public run = 'python'
}


/**
 * _Client_
 * Uses only interfaces declared by Abstract
 * Factory and Abstract Product classes.
 */
class Workspace {
  private command: Command
  private entry: Entry
  private req: Req

  constructor(public factory: WorkspaceFactory) {
    this.command = factory.command
    this.entry = this.createEntry()
    this.req = this.createReq()
  }

  public createEntry(): Entry {
    return this.factory.createEntry()
  }

  public createReq(): Req {
    return this.factory.createReq()
  }

  public install(): string {
    return this.req.mgr + ' ' + this.command.install
  }

  public run(): string {
    return this.command.run + ' ' + this.entry.fileName
  }
}


export { Workspace, PyFactory, JSFactory }