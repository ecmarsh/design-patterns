/**
 * COMPOSITE (Object tree)
 *
 * ------------------
 * Usage:
 * to represent part-whole hierarchies of objects.
 * to allow clients to treat composed and individual objects the same.
 *
 *
 * ------------------
 * Consequences:
 * + Makes heavy use of LSP.
 * + Makes client simple since don't care about actual receiver.
 * + Easy to add new kinds of components since newly defined Leafs/Composites work automatically with existing structures
 * - Can make design overly general, making it harder to restrict components of a composite.
 *
 *
 * ------------------
 * Implementation Notes:
 * Keeping a parent reference in the child can simply traversal and management of a composite structure.
 * Component class should specify as many common operations for Composite and leaf as possible, as long as they are meaningful to its subclasses.
 * Defining child management at root of class hierarchy provides more transparency, while defining child management in the Composite class gives you safety. It's a trade-off.
 * If ordering is important, use the Iterator pattern to manage sequence of children.
 * Cache frequent traversal paths to improve performance.
 *
 */


/**
 * **Component:**
 * Declares common interface for objects in composition.
 * Implements default behavior for
 * interface common to all classes.
 * Also declares interface for accessing
 * and managing child components.
 * Optionally defines an interface for accessing a
 * component's parent in the recursive structure.
 */
interface Common {
  name: string
  size: number
  parent: string | null
  add(child?: Common): void
  remove(child?: Common): void
  compress(): number
}

abstract class Component implements Common {
  abstract add(child?: Common): void
  abstract remove(child?: Common): void

  constructor(
    public name: string,
    public size = 4,
    public parent = null
  ) { }

  /** Compresses file size. Min size is 2 */
  compress = () => {
    this.size = (this.size >> 1) + 1
    return this.size
  }
}


/**
 * **Leaf**
 * Represents leaf objects (no children).
 * Defines behavior for primitive objects in composition.
 */
interface Leaf extends Common { }

class File extends Component implements Leaf {
  constructor(name: string, size: number) {
    super(name, size)
  }

  add = (child: Common) => {
    throw Error(`Cannot add ${child.name} to ${this.name}`)
  }

  remove = (child: Common) => {
    throw Error(`${this.name} has no children`)
  }
}


/**
 * **Composite:**
 * Defines behavior for components having children.
 * Stores child components and implements
 * child-related operations in component interface.
 */
interface Composite extends Common {
  add(child: Leaf): void
  remove(child: Leaf): void
  getChild(name: string): Leaf
}

class Directory extends Component implements Composite {
  protected children: { [key: string]: Common } = {}

  constructor(name: string, size?: number) {
    super(name, size)
  }

  compress = () => {
    Object.values(this.children).forEach(child => {
      this.size -= child.size - child.compress()
    })
    return this.size
  }

  add = (child: Leaf): void => {
    this.children[child.name] = child
    child.parent = this.name
    this.size += child.size
  }

  remove = (child: Leaf): void => {
    delete this.children[child.name]
    child.parent = null
    this.size -= child.size
  }

  getChild = (name: string) => this.children[name]
}


/**
 * _Client_
 * Manipulates objects in the composition
 * through the Component interface.
 * If the recipient is a Leaf, then
 * the request is handled directly.
 * If it is a Composite, then it forwards
 * requests to child components, possibly performing
 * additional operations before/after forwarding.
 */

export { File, Directory }