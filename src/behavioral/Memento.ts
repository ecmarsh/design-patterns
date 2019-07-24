/**
 * Memento (Token)
 *
 * ----------
 * Usage:
 * To capture and externalize an object's state for later use.
 * When a direct interface to obtaining state would break encapsulation by exposing implementation details.
 *
 * ----------
 * Consequences:
 * + Preserves encapsulation.
 * + Simplifies the originator object. clients only manage the state they ask for.
 * - Mementos can be expensive if state that needs to be copied is large or if too frequently.
 * - A caretaker might incur large storage costs when storing mementos since it is ignorant of amount of state in Memento.
 *
 * Note: If state/changes are in a predictable sequence, you can simply store the incremental change. (E.g undos)
 * 
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
  getState(): string
}

class Commit implements Memento {
  private state: FileData

  public constructor(state: string) {
    this.state = JSON.parse(state)
  }

  public getState() {
    return JSON.stringify(this.state)
  }
}

/**
 * The state for the memento to store.
 * In this case, it is the entire state, but
 * it may be only partial if some aspects don't vary.
 */
interface State { }
interface FileData extends State {
  name: string
  text: string
  sizeBytes: number
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

class File implements Originator {
  private state: FileData

  public constructor(name: string = 'Untitled.txt', text: string = '') {
    this.state = {
      name,
      text,
      sizeBytes: text.length + 1
    }
  }

  public setMemento(memento: Memento) {
    this.state = JSON.parse(memento.getState())
  }

  public createMemento(): Memento {
    return new Commit(JSON.stringify(this.state))
  }

  // Methods specific to example
  public rename(name: string) {
    const state = { ...this.state }
    state.name = name
    this.state = state
  }

  public addText(text: string) {
    const state = { ...this.state }
    state.text += text
    state.sizeBytes += text.length
    this.state = state
  }
}


/**
 * **Caretaker:**
 * Responsible for the memento's safekeeping.
 * Where the mechanisms are called.
 * _Never_ operates on or examines the contents of a memento.
 */
interface Caretaker {
  addMemento(memento: Memento): string
  getMemento(key: string): Memento
}

class MementoCareTaker implements Caretaker {
  protected mementos: { [id: string]: Memento } = {}

  public addMemento(memento: Memento): string {
    const id = this.makeUniqueId()
    this.mementos[id] = memento
    return id
  }

  public getMemento(id: string): Memento {
    return this.mementos[id]
  }

  /** Ensures the generated id is unique. */
  private makeUniqueId(): string {
    let id: string
    do {
      id = this.makeId()
    } while (id in this.mementos)
    return id
  }

  /** Imitates the SHA-1 hash, but stores only the first 7 characters. */
  private makeId(): string {
    return Math.random()
      .toString(16)
      .substring(2, 9)
      .toUpperCase()
  }
}


/**
 * _Client_
 * Requests mementos from originator.
 * Caretaker can be updated as a side effect
 * (e.g if "committed" changes on every file change)
 * or invoked by client as in this example.
 */
class Git extends MementoCareTaker {
  public static init(originator: Originator) {
    return new Git(originator)
  }

  private originator: Originator

  public constructor(originator: Originator) {
    super()
    this.originator = originator
  }

  public commit() {
    return this.addMemento(
      this.originator.createMemento()
    )
  }

  public rebase(id: string) {
    return this.originator.setMemento(
      this.getMemento(id)
    )
  }

  public checkout(id: string) {
    return this.getMemento(id)
  }

  public log() {
    return Object.keys(this.mementos)
  }
}


export { Git, File }