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
  call(extrinsicState?: string): string
}


/**
 * **Shared Concrete Flyweight:**
 * Implements flyweight interface.
 * Adds storage for intrinsic state if any.
 * Must be sharable and any state it stores
 * should be independent of its context.
 */
interface ConcreteFlyweight extends Flyweight {
  code: string // intrinsicState
}

class AreaCode implements ConcreteFlyweight {
  public constructor(public code: string) {}
  public call(tel?: string): string {
    return `+1${this.code}${tel}`
  }
}


/**
 * **Unshared Concrete Flyweight:**
 * Not all subclasses of flyweight need to be shared.
 * May or may not have shared concrete flyweights as children.
 * Since these may be only closely related to concrete flyweights,
 * it could be tempting to let Client instiate these instead of
 * going through factory. However, leaving them in factory allows
 * us to add these to sharables later without client being affected.
 */
class ServiceCode implements Flyweight {
  public constructor(private tel: string) {}

  public call() {
    return this.tel
  }
}


/**
 * **Flyweight Factory:**
 * Manages flyweight objects and supplies
 * flyweight instances or creates one if none exists.
 * Ensures that flyweights are shared properly.
 */
class FlyweightFactory {
  private static flyweights: { [code: string]: ConcreteFlyweight } = {}
  /**
   * Create an instance with available methods to
   * manipulate the FlyweightFactory Singleton.
   * The instances methods are the Singletons;
   * remember to cleanup after using.
   */
  public static createTestable(): Testable {
    const { clear, getCount } = FlyweightFactory
    return { clear, getCount }
  }
  /**
   * Returns the existing or newly created instance of a
   * flyweight containing shared method(s) or data.
   */
  public static getFlyweight(code: string) {
    if (!FlyweightFactory.flyweights[code]) {
      FlyweightFactory.register(new AreaCode(code))
    }
    return FlyweightFactory.flyweights[code]
  }
  /**
   * Returns an unshared flyweight simply by
   * creating an instance. We leave this in the factory
   * in case we decide to share data/methods later.
   */
  public static getUnsharedFlyweight(tel: string) {
    return new ServiceCode(tel)
  }
  /**
   * Clears all registered flyweights in factory Singleton.
   * Use for isolated testing and cleanup.
   */
  private static clear() {
    FlyweightFactory.flyweights = {}
  }
  /**
   * Returns count of number of stored flyweights.
   * Use to compare with number of objects created.
   */
  private static getCount() {
    return Object.keys(FlyweightFactory.flyweights).length
  }

  private static register(flyweight: ConcreteFlyweight) {
    FlyweightFactory.flyweights[flyweight.code] = flyweight
  }
}



/**
 * _Client:_
 * Maintains reference to flyweights.
 * Computes or stores exstrinsic state of flyweights.
 * Should obtain Flyweight objects from the Factory.
 */

 interface Testable {
   clear(): void
   getCount(): number
   [key: string]: (...args: any[]) => any
 }

 /**
  * Maintains a registry of phone numbers.
  * Use to compare against number of flyweights.
  */
class YellowPages {
  private static directory: Set<Phone> = new Set()

  public static createTestable(): Testable {
    const { getCount, clear } = YellowPages
    return { getCount, clear }
  }

  public static register(phone: Phone) {
    YellowPages.directory.add(phone)
  }

  private static getCount() {
    return YellowPages.directory.size
  }

  private static clear() {
    YellowPages.directory.clear()
  }
}

class Phone {
  /** The last seven digits of a phone number, stored as string */
  public tel: string
  public areaCode: AreaCode

  /** Example: '4151234567' */
  public constructor(fullTel: string) {
    this.areaCode = FlyweightFactory.getFlyweight(fullTel.substring(0, 3))
    this.tel = fullTel.substring(3)
    this.register()
  }

  public call() {
    return this.areaCode.call(this.tel)
  }

  private register() {
    YellowPages.register(this)
  }
}

class ServicePhone {
  private tel: Flyweight

  /** Example: '911' */
  public constructor(fullTel: string) {
    this.tel = FlyweightFactory.getUnsharedFlyweight(fullTel)
  }

  public call() {
    return this.tel.call()
  }
}


export { FlyweightFactory, YellowPages, Phone, ServicePhone }
