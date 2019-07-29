/**
 * State (Object for States)
 * 
 * -----------------
 * Usage:
 * When an object's behavior depends on its state and its behavior must change at run time.
 * When operations have large, multipart conditional statements that depend on the objects state, usually represented by one or more enums. State pattern puts each branch of the conditional in a separate class to treat object's state as an object its its own right that can vary independently from other objects.
 * 
 * -----------------
 * Consequences:
 * + Localizes state-specific behavior and partitions behavior for different states by putting all behavior associated with particular state into one object so new states and transitions can be added easily by defining new subclasses.
 * + Makes state transitions explicit through introducing separate objects for different states. Avoids having an object define its current state solely in terms of internal data values leaving transitions with no explicit representation.
 * + State objects protect context from inconsistent internal states because they are atomic from Context's perspective (happen by rebinding _one_ variable, the context's state object and not several).
 * + State objects can be shared by contexts if they have no instance variables (essentially acting as flyweights). The state represent is encoded entirely in their type.
 * 
 * -----------------
 * Implementation Notes:
 * In general, it is more flexible to let the state subclasses specify their sucessor state and when to make the transition. This is implemented by adding an interface to the Context that lets state objects set Context's current state explicitly, thereby decentralizing the transition logic. However, this introduces implementation dependencies between subclasses since one state subclass will have knowledge of at least one other.
 * Another alternative is to use a table-driven state machines where for each state, a table maps every possible input to a succeeding state which allows you to change the transition criteria by modifying data instead of changing program code. But, this is usually less efficient than a function call, makes transition logic less explicit, and makes it harder to add actions to accompany state transitions.
 * If state objects store much information, states aren't known at runtime, and contexts change state infrequently, create state objects only when needed and destroy them after.
 * If state changes occur rapidly, create them ahead of time and save them for later use. This requires keeping references to all states that might entered. Instantiation costs are paid up front and there are no destruction costs.
 * Dynamic languages/delegation-based like JS allow changing object's class at runtime supporting the state pattern directly. Objects delegate operations to other objects to achieve dynamic inheritance.
 * 
 */


/**
 * **Context:**
 * Defines interface of interest to clients.
 * Maintains an instance of a Concrete State subclass
 * that defines the current state.
 * Delegates state-specific request to the
 * current Concrete State Object.
 * May pass itself as an argument to the state handling request
 * so it lets the state object access the context if necessary.
 */
class Context {
  private state: State // May aggregate

  public constructor(state: State) {
    this.state = state
  }

  public request() {
    this.state.handle()
  }
}


/**
 * **State:**
 * Defines interface for encapsulating behavior
 * associated with a particular state of the Context.
 */
interface State {
  handle(): any
}


/**
 * **Concrete State subclasses:**
 * Each subclass implements a behavior
 * associated with a state of the Context.
 */
class ConcreteState implements State {
  public handle() { }
}


/**
 * _Client_
 * Uses primarily the Context interface.
 * Can configure a context with state objects.
 * Once configured, clients don't have to deal
 * with the state objects directly.
 */


export { }