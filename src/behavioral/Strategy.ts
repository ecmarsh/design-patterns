/**
 * Strategy (AKA Policy)
 *
 * -----------------
 * Usage:
 * - Define family of algorithms, encapsulate each one, and
 *   make them interchangable.
 * - Allows the algorithm to vary independently from clients that use it.
 * - Use when different algorithms may be appropriate at differen times.
 * - Use when many related classes differ only in behavior. Can configure 
 *   a class with one of many behaviors.
 * - An algorithm uses data that clients shouldn't know about (to not expose
 *   complex algorithms or specific data-structures)
 * - To replace many conditional branches into their own strategy class.
 *
 * -----------------
 * Consequences:
 * + Eliminates many conditional statements.
 * + Encapsulating algorithm in separate Strategy classes allows you 
 *  to vary the algorthm indpendently of its context. If you subclass
 *  Context directly (inheritance), it hardwires the behavior into
 *  Context making it harder to understand, maintain and explain, ending
 *  up with many related classes differ only in behavior they employ.
 * - Clients must be aware of the different strategies in order to choose
 *   the appropriate one for their needs. Variation in behavior should be
 *   relevant to clients.
 * - There are times when Contexts may create parameters that aren't used
 *   for cases when the Strategy is a simple one. Solve by introducing
 *   tighter coupling between Strategy and Context.
 * - Increased number of objects: increases app sizes. Sometimes can reduce
 *   by implementing strategies as stateless objects that contexts can share.
 *   Any residual state is maintained by context, which passes it in
 *   each request to the Strategy object.
 *
 * -----------------
 * Implementation Notes:
 * - Stategies can provide different implementations of same behavior.
 * - Hierarchy: inheritance in Strategy to factor out
 *   commonalities of related algorithms.
 * - Define interfaces for Context and Strategy to give efficient
 *   access to any data it needs from a context and vice versa.
 * - Use templates to configure a class with a strategy IFF Strategy
 *   can be selected at compile-time and it doesn't have to be changed
 *   at runtime.
 * - Can make Strategy optional, to have Context implement a default behavior,
 *   allowing the client to change only if they don't like the default.
 * - Strategy objects often make good flyweights.
 *
 */

/**
 * Strategy (Compositor)
 * Declares an interface common to all supported algorithms.
 * Context uses interfaces to call algorithm defined by `ConcreteStrategy`.
 */
interface Strategy {
  route(from: number, to: number): number[]
}

/**
 * ConcreteStrategy
 * Implements the algorithm using the `Strategy` interface.
 * Normally there is a family of ConcreteStrategy classes to choose from.
 */
abstract class ConcreteStrategy implements Strategy {
  public route(from: number, to: number): number[] {
    return [from, to]
  }
}

/**
 * Context (Composition)
 * - configured with `ConcreteStrategy` object
 * - maintains reference to a Strategy obj, but doesn't care which one it uses.
 * - may define an interface that lets `Strategy` access its data.
 * - can pass all data necessary to Strategy or can pass itself as an argument.
 * - forwards requests from its client to its strategy.
 */
interface Context {
  setPickup(locationID: number): void
  setDestination(locationID: number): void
  buildRoute(from: number, to: number): number[]
}

class Navigator {
  public constructor(private strategy: Strategy) {
    this.strategy = strategy
  }
}

/**
 * Client
 * - Usually create and passes the `ConcreteStrategy` object to context
 *   so clients interact with the context exclusively.
 */

export {}