/**
 * SINGLETON
 *
 * ------------
 * Usage:
 * when there must be exactly one instance of a class
 * when the instance must be accessible at a well-known access point
 * when sole instance should be extensible by subclassing, and clients should be able to use an extended instance without modifying their code
 *
 *
 * -------------
 * Consequences:
 * + Controlled access to sole instance
 * + Reduced name space - avoids polluting global name space
 * + Easy to configure application by subclassing the singleton
 * + Permits a variable number of instances and only have to change Singleton
 * + More flexible than class operations
 *
 *
 * Note: If you have many Singleton's, may want to use a registry of singletons,
 * and allow the Singleton class to register their instance in the registry.
 */


/**
 * **Singleton:**
 * Defines an instance operation that lets
 * clients access its unique instance.
 * Instance is a static class method and may be
 * responsible for creating its own unique instance.
 */
class Database {
  private static instance: Database | null = null

  public static getInstance(config = {}) {
    if (!Database.instance) {
      Database.instance = new Database(config)
      Object.seal(Database.instance)
    }
    return Database.instance
  }

  /** Check if Singleton exists. Mainly for testing. */
  public static isInitialized = () =>
    Database.instance != null

  /** Setup or teardown method. */
  public static clean = () =>
    Database.instance = null

  public query(table: string) {
    if (table in this._data) {
      return this._data[table]
    }
  }

  /** Extension is allowed, **no** instances */
  protected constructor(private config: object) { }

  private _data: { [key: string]: any[] } = {
    users: [
      { id: 1, name: 'user1' },
      { id: 2, name: 'user2' },
    ]
  }
}


export { Database }
