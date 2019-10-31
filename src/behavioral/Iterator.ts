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
  first(): void            // positions iterator to first element
  next(): void             // advances position
  isDone(): boolean        // is all items iterated
  getCursor(): number|void // returns item at current index
}

/**
 * **Concrete Iterator**
 * Implements the Iterator interface.
 * Keeps track of the current position
 * in the traversal of the aggregate (cursor/internal).
 * Can compute the suceeding object in the traversal.
 * BST Iterator iterates its values in ascending order.
 * Separating the iteration allows us to change implementation,
 * or clients to use alternate iterators.
 * e.g We could do desc order traversal by traversing right first (postorder)
 */
class BSTIterator implements Iterator {
  private cursor: MaybeTreeNode
  private stack: TreeNode[]

  public constructor(private root: TreeNode) {
    this.root = root
    this.cursor = root
    this.stack = []
    this.traverseLeft(root)
    this.next()
  }
  public first() {
    this.stack = []
    this.traverseLeft(this.root)
    this.next()
  }
  public next() {
    const next: MaybeTreeNode = this.stack.pop();
    next && next.right && this.traverseLeft(next.right)
    this.cursor = next 
  }
  public isDone(): boolean {
    return typeof this.cursor === 'undefined'
  }
  public getCursor(): number|void {
    if (this.cursor) {
      return this.cursor.val
    }
  }

  private traverseLeft(node: MaybeTreeNode) {
    while (node) {
      this.stack.push(node)
      node = node.left
    }
  }
}

/** Definition for BST node */
class TreeNode {
  public constructor(
    public val: number,
    public left?: TreeNode,
    public right?: TreeNode, 
  ) {}
}

type MaybeTreeNode = TreeNode|void

/**
 * **Aggregate**
 * Defines interface for creating iterator object.
 * Note aggregate/collection stores the data structure,
 * though excluded from interface as structure is private.
 */
interface Aggregate {
  createIterator(): Iterator
}


/**
 * **Concrete Aggregate**
 * Implements Iterator creation iterface to
 * return an instance of proper Concrete Iterator.
 * Maintains a reference to its root node.
 */
class BSTCollection implements Aggregate {
  private root: TreeNode
  private DefaultIterator = BSTIterator

  public constructor(data: number[], CustomIterator?: typeof BSTIterator) {
    this.root = this.buildTree(data)!
    if (CustomIterator) {
      this.DefaultIterator = CustomIterator
    }
  }

  public createIterator(): BSTIterator {
    return new this.DefaultIterator(this.root)
  }

  protected buildTree(data: number[]) {
    data = data.slice().sort((a, b) => a - b) // don't modify input array 
    const build = (left: number, right: number) => {
      if (left > right) return
      const mid = (left + right + 1) >> 1
      const leftNode = build(left, mid-1) 
      const root = new TreeNode(data[mid])
      root.left = leftNode
      root.right = build(mid+1, right)
      return root
    }
    return build(0, data.length-1)
  }
}


/**
* **Client**
* Interacts with Aggregate (or aggregate wrapper if internal iterator),
* and Iterator interfaces.
* In this example, client can create a BST Collection (aggregate),
* create the iterator, and use the iterator interface to control traversal.
*/
function traverse(iter: Iterator) {
  const data = []
  iter.first()
  while (!iter.isDone()) {
    data.push(iter.getCursor())
    iter.next()
  }
  return data
}

export { BSTCollection, BSTIterator, traverse }
