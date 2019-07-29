/**
 * Observer (Dependents, Pub-Sub)
 * 
 * -----------------
 * Usage:
 * When an abstraction has two aspects where one is dependent on the other.
 * When a change to one object requires changing a variable amount of others.
 * When an object needs to notify others without caring about who is notified.
 * 
 * -----------------
 * Consequences:
 * + Allows independent variance; you can reuse subjects without reusing their observers and vice versa. You can add more observers w/o changing subject or other observers.
 * + Abstract coupling between Subject and Observer. All subject knows is that it has Observers implementing the specified interface. Helps in situations where need to break through architectural boundaries in different layers.
 * + Support for broadcast communication. Doesn't need to specify receiver.
 * - Unexpected updates. A single change can cause an unknown amount of expensive updates. Poorly managed dependencies can make it hard to track down bugs deriving from these unexpected updates.
 * 
 * -----------------
 * Implementation Notes:
 * Simplest way to keep track of observers is to store explicit references in subject. This only works if there aren't too many.
 * Observers may require dependence on more than one subject, in which case notifications should signal which subject is sending the notification.
 * Two options for who triggers the update notifications:
 *  1. Subject state-changes invokes notify after completion. Allows ease of use but possibly results in too many updates if not controlled.
 *  2. Let clients control updates at the right time. Advantage is only invoke updates when needed, but then there's an extra task for client to call, resulting in higher probability of errors.
 * Remember to broadcast a deletion when deleting subject to avoid null pointers. You don't want to just delete its observers too, let the observers handle.
 * Make sure subjects state is self-consistent (doesn't call inherited operations), mostly because observers may query the subject for its current state after updating. You can avoid a state being inconsisten by sending notifications from template methods in abstract subject classes. Notify would be the last abstract operation in the template method for subclasses to override.
 * _Important_: Clearly document which subject operations trigger notifications.
 * Avoid observer-specific update protocols, such as the _push model_ where the subject sends observers detailed info about the change whether they want it or not or the _pull model_ where subject sends nothing but most minimal notification and observers ask for details explicitly after. Pull emphasizes subjects ignorance of observers but may be inefficient if observers usually have to ask for more but push makes observers less reusable since Subject makes assumptions about observers that may not always be true.
 * Improve update efficiency by extending subject's registration interface to allow registering observers only for specific events of interest so the subject only informs those interested for an update. You can implement this by using _aspects_ (interests) with observer registration.
 * For complex dependency relationships, encapsulate update semantics using a _Change-Manger_ to maintain the relationships and minimize the work required to make observers reflect a change in their subject.
 * _Change-Manger_ acts as a _mediator_ and has 3 responsibilities:
 *  1. Map a subject to its observers and provide an interface to maintain the mapping thereby eliminating the need for subjects/objects to maintain refs to each other.
 *  2. Define a particular update strategy.
 *  3. Update dependent observers at request of a subject.
 * Sometimes it makes sense to combine subject and observer to one object either through multiple inheritance or defining both interfaces in one class.
 * 
 */


/**
 * **Subject:**
 * Knows its observers, which may be of any amount.
 * Provides an interface for attaching/detaching observers.
 */
interface Subject {
  attach(observer: Observer): any
  detach(observer: Observer): any
  notify(): void
}

interface SubjectState { }

/**
 * **Observer:**
 * Defines an updating interface for objects that
 * should be notified of changes in a subject.
 */
interface Observer {
  update(): any
}

interface ObserverState { }


/**
 * **Concrete Subject:**
 * Stores state of interest Concrete Observers.
 * Sends a notification to its observers when state changes.
 */
class ConcreteSubject implements Subject {
  private observers: { [key: string]: Observer } = {}

  private state: SubjectState

  public constructor(initialState: SubjectState) {
    this.state = initialState
  }

  // Specific to concrete subject
  public getState(): SubjectState {
    return this.state
  }

  public setState(updatedState: SubjectState): SubjectState {
    this.state = Object.assign({}, this.state, updatedState)
    return this.getState()
  }

  // Interface
  public attach(observer: Observer) { }
  public detach(observer: Observer) { }
  public notify() {
    // Notify all observers
    for (const key in this.observers) {
      this.observers[key].update()
    }
  }

}


/**
 * **Concrete Observer:**
 * Maintains a reference to a Concrete Subject.
 * Stores state that should stay consistent w/ subject's.
 * Implements Observer upating interface to align state w/ subjects.
 * After being informed of change, may query subject for information
 * in order to reconcile its state with that of the subject.
 * Notification can be called by another observer or different type of object.
 */
class ConcreteObserver implements Observer {
  public subject: ConcreteSubject
  private state: ObserverState

  public constructor(initialState: ObserverState, subject: ConcreteSubject) {
    this.state = initialState
    this.subject = subject
  }

  public update() {
    this.subject.getState()
  }
}



export { }