/**
 * FLYWEIGHT
 *
 * ----------
 * Usage
 * When all of following are true:
 * app uses large number of objects making storage costs high
 * most object state can be made extrinsic
 * many groups of objects can be replaced with fewer shared objects by removing extrinsic state
 * the app doesn't depend on object identity - conceptually distinct objects may appear identical due to sharing
 *
 *
 * ----------
 * Consequences:
 * + can save storage depending on how many instances are reduced by sharing, the amount of intrinsic state per object, and whether extrinsic state is computed or stored. More sharing = more storage savings.
 * - may introduce run-time costs associated with making extrinsic state
 *
 *
 * ---------
 * Notes
 * *Intrinsic state* is stored in the Flyweight and consists of information independent of the flyweight's context, making it sharable.
 * *Extrinsic state* depends on flyweight's context so can't be shared.
 * A composite is often used with Flyweight (same tree representation), but leafs cannot have refs to parent. Instead, parent pointer is passed to flyweight as part of its ext state.
 * Use a separate object structure w/ smaller storage requirements to compute estrinsic state.
 * In JS, a lot of this is already done through the prototype chain.
 *
 */


/**
 * **Flyweight:**
 * Declares interface which flyweights
 * can receive and act on extrinsic state.
 * Enables sharing but does not enforce it.
 */
interface Flyweight {
  id: number
  operation(...extrinsicState: any[]): any
}


/**
 * **Shared Concrete Flyweight:**
 * Implements flyweight interface.
 * Adds storage for intrinsic state if any.
 * Must be sharable and any state it stores
 * should be independent of its context.
 */
interface ConcreteFlyweight extends Flyweight {
  intrinsicState: any
}

class CFW implements ConcreteFlyweight {
  constructor(
    public id: number,
    public intrinsicState: any
  ) { }

  operation(...extrinsicState: any[]) { }
}


/**
 * **Unshared Concrete Flyweight:**
 * Not all subclasses of flyweight need to be shared.
 * May or may not have shared concrete flyweights as children.
 */
interface UnsharedConcreteFlyweight extends Flyweight { }

class USCFW implements UnsharedConcreteFlyweight {
  constructor(public id: number, rest: any) { }
  operation(...extrinsicState: any[]) { }
}


/**
* **Flyweight Factory:**
* Manages flyweight objects and supplies
* flyweight instances or creates one if none exists.
* Ensures that flyweights are shared properly.
*/
class FlyweightFactory {
  private static flyweights: { [key: string]: Flyweight } = {}
  /**
   * Create an instance with available methods to
   * manipulate the FlyweightFactory Singleton.
   * The instances methods are the Singletons;
   * remember to cleanup after using.
   */
  public static createInstance() {
    const { getFlyweight, clear } = FlyweightFactory
    return { getFlyweight, clear }
  }
  /**
  * Clears all registered flyweights in factory Singleton.
  * Use for isolated testing and cleanup.
  */
  private static clear() {
    FlyweightFactory.flyweights = {}
  }
  /**
  * Returns the existing or newly created instance of a
  * flyweight containing shared method(s) or data.
  */
  private static getFlyweight(id: number, ...rest: any[]) {
    if (!FlyweightFactory.flyweights[id]) {
      FlyweightFactory.register(new CFW(id, rest))
    }

    return FlyweightFactory.flyweights[id]
  }

  private static register(flyweight: Flyweight) {
    FlyweightFactory.flyweights[flyweight.id] = flyweight
  }
}


/**
 * _Client:_
 * Maintains reference to flyweights.
 * Computes or stores exstrinsic state of flyweights.
 * Should obtain Flyweight objects from the Factory.
 */


export { FlyweightFactory }