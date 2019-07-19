/**
 * FACADE
 *
 * ---------
 * Usage:
 * to make a complex subsystem easier to use with a simple higher-level api
 * when there are many deps between clients and abstraction impls
 * you want to layer your subsystems - use the facade to define the entry point to each susbystem level
 *
 * ---------
 * Consequences:
 * + Shields clients from subsystem components to make easier to use
 * + Promotes weak coupling between low-level subystem and clients. Can prevent breaking changes when updating subsystem.
 * + Doesn't prevent applications from using clases if they need to.
 *
 * Note: Proxy is not the same as it shares the same interface as the "subsystem", so is interchangable. Facade provides a simpler interface.
 */


/**
 * **Facade:**
 * Knows which subsystem classes are responsible for a request
 * and delegates client requests to subsystem accordingly.
 * May occasionally do work of its own before passing along
 * request to the appropriate subsystem.
 */
interface Facade {
  runDev(): Config
  runProd(): Config
}

interface Config {
  url: string
  es: number
  styles: string
  hot: boolean
}

class Scripts implements Facade {
  public runDev() {
    return {
      url: DevServer.getURL(3000),
      es: Babel.transpile(2018),
      styles: Styles.get(),
      hot: true
    }
  }

  public runProd() {
    return {
      url: ProdServer.getURL(),
      es: Babel.transpile(2014),
      styles: new Processor(Styles.get()).process(),
      hot: false
    }
  }
}


/**
 * **Subsystem Classes**
 * Implement subsystem functionality.
 * Handle work assigned by the Facade object.
 * Have no knowledge of Facade (no refs to Facade).
 */
class DevServer {
  public static getURL = (port: number) => `http://localhost:${port}/`
}
class ProdServer {
  public static getURL = () => `http://www.website.com'`
}
class Babel {
  public static transpile = (target: number) => target - 2009
}
class Styles {
  private static css = 'CSS'
  public static get = () => Styles.css
}
class Processor {
  constructor(private css: string) { }
  public process = () => 'processed ' + this.css
}


/**
 * _Client_
 * Communicates through Facade to subsystem.
 * Do not have access to subsystem objects directly.
 */
export default Scripts
/** Test servers were called */
export { DevServer, ProdServer }