/**
 * Interpreter
 *
 * ------------
 * Usage:
 * When there is a language to interpret and you can represent statements in the language as ASTs. Works best when:
 * - grammar is simple and manageable
 * - efficiency is not a critical concern since interpreters usually need to transforming parse trees.
 *
 * ------------
 * Consequences:
 * + Easy to change and extend the grammar since each rule has a corresponding class.
 * + Adding new ways to interpret expressions is easy since you can do so by defining a new operation on the expression classes.
 * - Because each rule has a class, complex grammars are hard to maintain.
 *
 * ------------
 * Implementation Notes:
 * The Interpret operations at each node use the context to store and access the state of the interpreter.
 * If there are many ways of interpreting an expression, consider using the Visitor pattern to avoid changing grammar classes. In this case, put the `interpret` operation in the visitor, not in the expression.
 * The interpreter pattern does not include _creation_ of the AST.
 * You can use the Flyweight pattern to share terminal symbols. Terminal nodes receive their position on the AST from the parent instead of storing it.
 */

/**
 * **Abstract Expression:**
 * Declares an abstract interpret operation
 * that is common to all nodes in the AST.
 */
interface AbstractExpression {
  interpret(context: any): any
}


/**
 * **Terminal Expression:**
 * Implements an interpret operation associated
 * with terminal symbols in the grammar.
 * An instance is required for every terminal
 * symbol in a sentence.
 */
class TerminalExpression implements AbstractExpression {
  interpret(context: any) { }
}


/**
 * **NonTerminal Expression:**
 * One class is required for every rule in the grammar.
 * Maintains instance variables of type Abstract Expression
 * for each of class representing rule in the grammar.
 * Implements `interpret()` for non-terminal symbols in the grammar.
 * Interpret typically calls itself recurisvely on each
 * of the symbols representing the class for every rules.
 * Defines `interpret()` in terms of Interpret for each subexpression.
 * The interpret op of each Terminal Exp
 * defines the recursion base case.
 */
class NonTerminalExpression implements AbstractExpression {
  interpret(context: any) { }
}

/**
 * **Context:**
 * Contains information global to the interpreter.
 */


/**
 * _Client:_
 * Builds or is given an AST representing a particular
 * sentence in the language that the grammar defines.
 * The AST is assembled from instances of the
 * Nonterminal Expression and Terminal Expression classes.
 * Responsible for invoking `interpret()`.
 */

export { }