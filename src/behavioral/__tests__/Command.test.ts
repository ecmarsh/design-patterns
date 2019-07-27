import {
  CalculatorApp,
  CommandStack,
  Calculator,
  CalcComputer,
  SimpleCommand,
  Plus
} from '../Command'

// No-op agregatee placeholder to test command aggregators
let simpleCommand: SimpleCommand
beforeEach(() => {
  class TestCommand extends SimpleCommand {
    operation = (x: any, y: any) => 0
  }
  simpleCommand = new TestCommand(new CalcComputer(), 0)
})

describe('Command', function testCommand() {

  describe('Command Stack', () => {
    let stack: CommandStack

    test('Initialization', () => {
      stack = new CommandStack()
      expect(stack.isEmpty()).toBe(true)
    })

    test('Insertion', () => {
      stack.append(simpleCommand)
      expect(stack.isEmpty()).toBe(false)
    })

    test('Deletion', () => {
      stack.append(simpleCommand)
      const lastIn = stack.pop()
      expect(lastIn).toBe(simpleCommand)
    })
  })

  describe('Calculator Invoker', () => {
    test('Set command', () => {
      const calc = new Calculator()
      const numCommands = calc.setCommand(simpleCommand)
      expect(numCommands).toEqual(1)
    })

    test('Execute last command', () => {
      const calc = new Calculator()
      const execute = jest.spyOn(simpleCommand, 'execute')
      calc.setCommand(simpleCommand)
      calc.executeCommand()
      expect(execute).toHaveBeenCalledTimes(1)
    })

    test('Throw if no commands', () => {
      const calc = new Calculator()
      const doExecute = () => calc.executeCommand()
      expect(doExecute).toThrowError(/Invoker needs a command to execute/)
    })
  })

  describe('Calculator App', () => {
    test('Display', () => {
      const app = new CalculatorApp()
      expect(app.display()).toEqual(0)
    })

    test('Equals', () => {
      const app = new CalculatorApp()
      // Equals evaluates stored commands.
      // If no commands are set, it should display value
      expect(app.equals()).toEqual(0)
      const equalsSpy = jest.spyOn(app, 'equals')
      app.add(0)
      app.equals()
      expect(equalsSpy).toReturn()
    })

    test('Plus', () => {
      const app = new CalculatorApp()
      app.add(3)
      expect(app.equals()).toEqual(3)
      app.add(4)
      expect(app.equals()).toEqual(7)
    })

    test('Minus', () => {
      const app = new CalculatorApp(4)
      app.subtract(1)
      expect(app.equals()).toEqual(3)
      app.subtract(2)
      expect(app.equals()).toEqual(1)
    })

    test('Delayed execution', () => {
      const app = new CalculatorApp(0)
      app.subtract(3).add(4).add(3)
      expect(app.equals()).toEqual(3)
      expect(app.equals()).toEqual(7)
      expect(app.equals()).toEqual(4)
      expect(app.equals()).toEqual(4)
    })
  })
})
