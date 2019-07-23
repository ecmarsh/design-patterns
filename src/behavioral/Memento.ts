/**
 * Memento (Token)
 *
 * ----------
 * Usage:
 * To capture and externalize an object's state for later use.
 * When a direct interface to obtaining state would break encapsulation by exposing implementation details.
 *
 *
 * ----------
 * Consequences:
 * + Preserves encapsulation.
 * + Simplifies the originator object. clients only manage the state they ask for.
 * - Mementos can be expensive if state that needs to be copied is large or if too frequently.
 * - A caretaker might incur large storage costs when storing mementos since it is ignorant of amount of state in Memento.
 *
 * Note: If state/changes are in a predictable sequence, you can simply store the incremental change. (E.g undos)
 */

/**
 * **Memento:**
 * Stores necessary internal state of Originator.
 * Protects against access by objects other than Originator.
 * Has 2 interfaces:
 * 1. Caretaker sees a _narrow_ interface to the Memento
 *   - Can only pass memento to other objects.
 * 2. Originator sees a _wide_ interface to the Memento
 *   - Lets it access all data necessary to restore prev state.
 * Mementos are passive since only the memento
 * creator (Originator) will assign/retrieve its state.
 */
interface Memento {
  getState(): State
}

class M implements Memento {
  private state: State

  /** Narrow public interface? */
  public constructor(state: State) {
    this.state = state
    this.freezeState()
  }

  public getState() {
    return this.state
  }

  /** Make state immutable after construction. */
  private freezeState() {
    Object.freeze(this.state)
  }
}

/** The state for the memento to store */
interface State { }

interface File extends State {
  name: string
  text: string
  sizeKB: number
}

/**
 * **Originator:**
 * Creates a memento with its internal state snapshot.
 * Uses the memento to restore its internal state.
 */
interface Originator {
  setMemento(memento: Memento): void
  createMemento(): Memento
}

class O implements Originator {
  private state: State = {}

  public setMemento(memento: Memento) {
    this.state = memento.getState()
  }

  public createMemento(): Memento {
    return new M(this.state)
  }
}

/**
 * **Caretaker:**
 * Responsible for the memento's safekeeping.
 * Where the mechanisms are called.
 * _Never_ operates on or examines the contents of a memento.
 */
interface Caretaker {
  addMemento(memento: Memento): number
  getMemento(key: number): Memento
}

class CT implements Caretaker {
  private mementos: { [key: number]: Memento } = {}
  private lastKey: number = 0

  public addMemento(memento: Memento): number {
    this.mementos[++this.lastKey] = memento
    return this.lastKey
  }

  public getMemento(key: number): Memento {
    return this.mementos[key]
  }
}

/**
 * _Client_
 * Requests mementos from originator (as side effect?)
 */

export { CT }