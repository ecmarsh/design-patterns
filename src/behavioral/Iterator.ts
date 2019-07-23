/**
 * Iterator (Cursor)
 *
 * ----------
 * Usage:
 * When you want to provide a way to access elements of aggregate object sequentially w/o exposing underlying representation.
 * To support multiple types of traversals.
 * To support polymorphic iteration (provide uniform interface for traversing different aggreagate structures - the iterator can traverse multiple collections that match the interface).
 *
 * -----------
 * Consequences:
 * + Supports variations in traversal of an aggregate.
 * + Iterators simplify the Aggregate interface.
 * + Supports more than one traversal since an iterator keeps track of its own traversal state. Multiple traversals can be at different progressions.
 *
 * ----------
 * Implementation Notes:
 * _External iterator_: The client controls the iteration.
 * _Internal iterator_: The iterator controls it.
 * _Cursor iterator_: Iterator simply points to current position in the aggregate. The aggregate defines the traversal algorithm and uses the iterator just to store the state of the iteration. A client can invoke the next iteration with the cursor argument. Use this for accessing private variables. Otherwise, keeping the algorithm in the iterator allows iterator reuse on different aggregates.
 * _Robust iterator_: Ensures insertions and removals won't interfere with traversal, _without_ copying the aggregate, usually by registering the iterator with the aggregate.
 * Minimal interface to Iterator consists of First, Next, IsDone, and CurrentItem. Optionally, additional informations such as Previous or SkipTo may be useful.
 * An iterator can be viewed as an extension of the aggregate that created it (may have privelaged access).
 * Use internal iterators for recusive traversals such as on composites so it can call itself and store the path implicitly in the callstack.
 * _Null Iterators_: Degenerate iterator helpful for handling boundary conditions, it is _always_ done with traversal. Leaf elements would return an instance of NullIterator for uniform traversal.
 */

/**
 * **Iterator**
 * Defines an interface for accessing
 * and traversing elements.
 */
interface Iterator {
  first(): any
  next(): any
  isDone(): any
  getCurrent(): any
}


/**
 * **Concrete Iterator**
 * Implements the Iterator interface.
 * Keeps track of the current position
 * in the traversal of the aggregate.
 * Can compute the suceeding object in the traversal.
 */
class ConcreteIterator implements Iterator {
  first() { }
  next() { }
  isDone() { }
  getCurrent() { }
}


/**
 * **Aggregate**
 * Defines interface for creating iterator object.
 */
interface Aggregate {
  createIterator(): Iterator
}


/**
 * **Concrete Aggregate**
 * Implements Iterator creation iterface to
 * return an instance of proper Concrete Iterator.
 */
class ConcreteAggregate implements Aggregate {
  private iterator: Iterator

  public constructor(iterator: Iterator) {
    this.iterator = iterator
  }

  public createIterator() {
    return new ConcreteIterator()
  }
}


/**
* **Client**
* Interacts with Aggregate and Iterator interfaces.
*/

export { }