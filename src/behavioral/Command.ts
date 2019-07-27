/**
 * Command (Action, Transaction)
 * 
 * -----------------
 * Usage:
 * To paramaterize objects by an action to perform, you can experess paramaterization with a callback.
 * To specify, queue and execute requests at different times.
 * To support "undo" using the execute() operation to store state for reversing its effects in the command itself.
 * To support logging changes so they can be reapplied in case of a system crash.
 * To structure a system around high-level operations, built on primitive operations.
 * To model a transaction (encapsulates a set of changes to data). Command also makes it easy to extend system with new transactions.
 * 
 * -----------------
 * Consequences:
 * + Decouples invoking object from object that knows how to perform it.
 * + Commands are first-class objects.
 * + Possible to create composite commands.
 *   The "Macro Command" is an instance of the Composite pattern.
 * + Easy to add new commands since existing classes don't require change.
 * 
 * -----------------
 * Implementation Notes:
 * Commands can vary from simply defining a binding between receiver and actions that carry out request to implementing everything itself w/o delegation to receiver. Use the latter to define commands independent of existing classes, when no suitable receiver exists, or when a command knows its receiver implicitly.
 * Only use complex command patterns that support undo, transformations, conflict resolution, etc. when needed. Start simply with the task pattern. In short, YAGNI.
 */


/**
 * **Command:**
 * Declares an interface for executing an operation.
 */
interface Command {
  execute(): any
}

/**
 * **Concrete Command:**
 * Defines a binding between a receiver object and an action.
 * When commands are undoable, Concrete Command stores state
 * for undoing the command prior to invoking `execute`.
 * Invokes operations on its receiver to carry out the request.
 */
class ConcreteCommand implements Command {
  private receiver: Receiver
  private receiverArgs: any[]

  public constructor(receiver: Receiver, ...receiverArgs: any[]) {
    this.receiver = receiver
    this.receiverArgs = receiverArgs
  }

  public execute() {
    this.receiver.action(...this.receiverArgs)
  }
}


/**
 * _Client/Application_
 * Creates a Concrete Command object and
 * sets/specifies its receiver.
 */
function client() {
  const receiver = new ConcreteReceiver(),
    command = new ConcreteCommand(receiver),
    invoker = new ConcreteInvoker

  invoker.setCommand(command)
  invoker.executeCommand()
}


/**
 * **Invoker:**
 * Asks the command to carry out the request.
 * Issues a request by calling `execute` on the command.
 */
interface Invoker {
  setCommand(cmd: Command): any
  executeCommand(): any
}

class ConcreteInvoker implements Invoker {
  private command?: Command

  public setCommand(cmd: Command) {
    this.command = cmd
  }

  public executeCommand() {
    if (!this.command) {
      throw Error(
        'Invoker needs a command to execute. \
         Use setCommand(cmd) to set a command first.'
      )
    }
    this.command.execute()
  }
}


/**
* **Receiver:**
* Knows how to perform the operations
* associated with carrying out a request.
* Any class may serve as a Receiver.
*/
interface Receiver {
  action(...args: any[]): any
}

class ConcreteReceiver implements Receiver {
  public action(...args: any[]) {
    // Do action
  }
}


export { }
