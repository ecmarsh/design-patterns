/**
 * PROXY (Surrogate)
 *
 * ---------
 * Usage:
 * Whenever need for more versatile of sophisticated ref to object than a simple pointer
 * Remote Proxy - to provide local representation for an object in a different address space.
 * Virtual Proxy - create expensive objects on demand (image placeholder).
 * Protection Proxy - controls access to original object for different access rights.
 * Smart reference/pointers - also performs additional actions when object is accessed (e.g counting # of references to real object so it can be freed automatically when there are no more references, loading persistent object into memory when first referenced, checking that real object is locked before its accessed)
 *
 * ---------
 * Consequences:
 * + Remote proxy can hide the fact that object is elsewhere.
 * + Virtual proxy can perform optimizations with init on demand.
 * + Protection/smart ref allow additional housekeeping tasks upon access.
 *
 * Note: proxy can hide copy-on-write optimization method  - instead of copying actual objects, proxy copy just reference counts. When client requests operation that modifies the subject, decrement ref count and do the actual copying. (ex garbage collection)
 * Proxy can deal with multiple real subjects through a common subject interface.
 *
 * In JS, you can use built-in Proxy(RealSubject, Handler) for trapping requests.
 */

// PROXY
// Maintains a reference to subject for access.
// Provides interface identical to subjects.
// Controls access to real subject - may create/delete.
// Remote proxies encode requests for real subject.
// Virtual proxies (caching proxies) cache additional
// information in order to postpone accessing it.
// Protection proxy checks that caller has access permissions.
class Balancer implements Subject {
  private servers: { [key: string]: Server } = {
    santaClara: new Server('norcal.website.com', 'Santa Clara'),
    losAngeles: new Server('socal.website.com', 'Los Angeles')
  }

  public get = (endpoint: string, location: string) =>
    this.isNorCal(location)
      ? this.routeTo('santaClara').get(endpoint, '')
      : this.routeTo('losAngeles').get(endpoint, '')

  public post = (endpoint: string, data: Data, location: string) =>
    this.isNorCal(location)
      ? this.routeTo('santaClara').post(endpoint, data, '')
      : this.routeTo('losAngeles').post(endpoint, data, '')

  private routeTo = (server: string) => this.servers[server]
  private isNorCal = (location: string) => /^nor/i.test(location)
}


// SUBJECT<I>
// Defines common interface for RealSubject and Proxy
// so proxy can be used anywhere real subject is expected.
interface Subject {
  get(endpoint: string, location: string): Response
  post(endpoint: string, data: Data, location: string): Response
}

interface Response { status: number, content: string }
interface Data { [page: string]: string }

// REAL SUBJECT
// Defines real object that proxy represents.
class Server implements Subject {
  constructor(protected NS: string, public location: string) { }

  private pages: { [endpoint: string]: string } = {
    '/index': `Hello from ${this.NS} in ${this.location}`,
  }

  public get = (endpoint: string, location: string) => {
    if (endpoint in this.pages) {
      return responses(this.pages[endpoint]).ok
    }
    return responses().notFound
  }

  public post = (endpoint: string, data: Data, location: string) => {
    if (endpoint == '/newpage') {
      const [[page, body]] = Object.entries(data)
      this.pages[page] = body
      return responses().created
    }
    return responses().notAllowed
  }
}

// Helpers for magic numbers/strings + testing replication
function responses(content: string = '') {
  return {
    ok: { status: 201, content: content || 'OK' },
    created: { status: 201, content: content || 'Created' },
    notFound: { status: 404, content: content || 'Not Found' },
    notAllowed: { status: 405, content: content || 'Method not allowed' }
  }
}


export { Balancer, responses }