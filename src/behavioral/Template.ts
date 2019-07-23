import EventEmitter from 'events'
/**
 * Template Method
 *
 * ---------------
 * Usage:
 * When several almost identical algorithms with minor differences.
 * To implement the invariant parts of an algorithm once and leave it to subclasses to implement variable behavior.
 * To localize common behavior among subclasses and avoid duplication. "Refactoring to generalize".
 * To control subclass extensions by defining a template method that calls "hook" operations to permit extensions at specific points.
 *
 * ---------------
 * Consequences:
 * + Promotes code reuse.
 * + Inverted control structure. Parent class calls subclass, not vice versa. "Don't call us, we'll call you". (LSP may be violated)
 * - Template methods with many steps may be difficult to maintain.
 *
 * --------------
 * Implementation:
 * - Try to minimize the number of primitive operations needed to fulfill the abstract extension.
 * - Standardize a naming convention and stick with it.
 * - Remember to have template method specify which operations are hooks, and which are abstract operations.
 * Hooks: _may_ be overriden.
 * Abstract ops: _must_ be overriden.
 * - Template methods use inheritance to vary part of an algorithm,
 * while strategies use delegation to vary the entire algorithm.
 *
 */


/**
 * **Abstract Class**
 * Defines abstract primitive operations that concrete
 * subclasses define to implement algorithm steps.
 * The 'Template method' will call:
 * - concrete operations (on concrete or client classes)
 * - concrete abstract class operations
 * - abstract varying primitive operations
 * - factory methods
 * - hook operations that allows extension
 */
abstract class Component {
  /**
   * Abstract method that _must_ be overriden
   */
  abstract render(): string

  public emitter: EventEmitter
  public constructor() {
    this.emitter = new EventEmitter()
    this.listen()
  }

  /**
   * The Template method that calls the
   * abstract and hook primitive ops.
   */
  private listen() {
    this.emitter.once('init', () => {
      DOM.mount(this.render())
    })

    this.emitter.once('mount', () => {
      this.componentDidMount()
      DOM.mount(this.render())
    })

    this.emitter.on('update', () => {
      this.componentDidUpdate()
      DOM.mount(this.render())
    })

    this.emitter.once('unmount', () => {
      this.componentWillUnmount()
      this.emitter.removeAllListeners()
    })
  }

  protected setState(state: { [key: string]: any }) {
    this.state = Object.assign({}, this.state, state)
  }

  // Some "hooks" that subclasses may override
  protected state = {}
  protected componentDidMount() { }
  protected componentDidUpdate() { }
  protected componentWillUnmount() { }
}


/**
 * **Concrete Class(es)**
 * Implements the primitive operations to carry
 * out subclass-specific steps of an algorithm.
 * Relies on abstract class to implement the
 * invariant, primitive operations.
 */
class App extends Component {
  state: { [key: string]: string } = { stage: 'Rendered' }

  constructor() { super() }

  componentDidMount() {
    this.setState({ stage: 'Mounted' })
  }

  componentDidUpdate() {
    this.setState({ stage: 'Updated' })
  }

  render() {
    const { stage } = this.state
    return (`
      <>
        Stage: ${stage}
      </>
    `)
  }
}

/**
 * Imitates the DOM. No instances allowed.
 * The component mounts render's return here.
 * Use the static `body` property to test renders.
 */
class DOM {
  private constructor() { }
  public static body = ''
  public static mount = (markup: string): void => {
    DOM.body = markup
  }
}


export { App, DOM }
