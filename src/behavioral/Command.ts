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
 * 
 * To generalize, pass around an object w a callback and target, then use another object to invoke the callback on the target. Can be implemented in many ways. Helpful when commands vary may have different targets.
 */


/**
 * **Command**
 * Declares an interface for executing an operation.
 */
interface Command {
  execute(...args: any[]): any
}

/**
 * **Concrete Commands**
 * Defines a binding between a receiver object and an action.
 * When commands are undoable, Concrete Command stores state
 * for undoing the command prior to invoking `execute`.
 * Invokes operations on its receiver to carry out the request.
 */
abstract class SimpleCommand implements Command {
  protected abstract operation: Operation

  protected receiver: Receiver
  protected value: number

  public constructor(receiver: Receiver, value: number) {
    this.receiver = receiver
    this.value = value
  }

  public execute() {
    this.receiver.action(this.operation, this.value)
  }
}

class Plus extends SimpleCommand {
  protected operation: Operation = function add(x, y) {
    return x + y
  }

  public constructor(receiver: Receiver, value: number) {
    super(receiver, value)
  }
}

class Minus extends SimpleCommand {
  protected operation: Operation = function subtract(x, y) {
    return x - y
  }

  public constructor(receiver: Receiver, value: number) {
    super(receiver, value)
  }
}


/**
 * **Invoker**
 * Also known as 'Sender'.
 * Asks the command to carry out a request
 * by calling `execute` on the command.
 */
interface Invoker {
  setCommand(cmd: Command): any
  executeCommand(): any
}

class Calculator implements Invoker {
  private commandStack: CommandStack = new CommandStack()

  public setCommand(cmd: Command): number {
    return this.commandStack.append(cmd)
  }

  public executeCommand() {
    const command = this.commandStack.pop()
    if (!command) {
      const msg = 'Invoker needs a command to execute. Set a command first.'
      throw Error(msg)
    }
    command.execute()
  }
}

/** Stores commands. */
class CommandStack {
  private commands: Command[] = []
  private size: number = 0

  public isEmpty() {
    return this.size === 0
  }

  public append(cmd: Command): number {
    this.commands[this.size++] = cmd
    return this.size
  }

  public peek(): Command | void {
    if (!this.isEmpty()) {
      return this.commands[this.size - 1]
    }
  }

  public pop(): Command | void {
    const lastIn = this.peek()
    if (lastIn) {
      this.size--
      return lastIn
    }
  }
}


/**
* **Receiver:**
* The target of an object request.
* Knows how to perform the operations
* associated with carrying out a request.
* Any class can serve as a Receiver.
*/
interface Receiver {
  action(...args: any[]): any
  display(): any
}

type Operation = (x: number, y: number) => number

class CalcComputer implements Receiver {
  private value: number

  public constructor(value: number = 0) {
    this.value = value
  }

  public action(op: Operation, value: number = 0) {
    this.value = op(this.value, value)
  }

  public display(): number {
    return this.value
  }
}

/**
 * _Client_
 * Creates a Concrete Command object
 * and needs to set/specify its receiver.
 * Note its easy to add new operations by simply
 * creating another command objects (e.g mult/div).
 */
class CalculatorApp {
  private receiver: Receiver
  private invoker: Invoker

  public constructor(initialValue?: number) {
    this.receiver = new CalcComputer(initialValue)
    this.invoker = new Calculator()
  }

  public add(value: number): this {
    this.invoker.setCommand(new Plus(this.receiver, value))
    return this
  }

  public subtract(value: number): this {
    this.invoker.setCommand(new Minus(this.receiver, value))
    return this
  }

  public display(): number {
    return this.receiver.display()
  }

  public equals(): number | string {
    try {
      this.invoker.executeCommand()
    } catch (e) {
      // Swallow
    } finally {
      return this.display()
    }
  }
}


export {
  CalculatorApp,
  CommandStack,
  Calculator,
  CalcComputer,
  SimpleCommand,
  Plus,
  Minus,
}
