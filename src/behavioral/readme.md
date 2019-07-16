# Behavioral

Behavioral patterns are concerned with algorithm, the assignment of responsibilities between objects, and the patterns of communication between them. They help to focus on just the way objects are interconnected by shifting focus away from complex control flow that may be difficult to follow at run-time.

## Class Patterns

Behavioral class patterns use **inheritance to describe algorithms and flow of control:**

Name | Varying Aspect | Intent
---- | -------------- | ------
**Interpreter** | grammar and interpretration of a language | To define a representation for a languages grammer along with an interpreter that uses the representation to interpret sentences in the language.
**Template Method** | steps of an algorithm | To define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.

## Object Patterns

Behavioral object patterns describe **how a group of objects cooperate to perform a task** that no single object can carry out alone, and **how peer objects know about each other**:

Name | Varying Aspect | Intent
---- | -------------- | ------
**Chain of Responsibility** | the object that can fulfill a request | To avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.
**Command**| when and how a request is fulfilled | To encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.
**Iterator** | how an aggregate's elements are accessed, traversed | To provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.
**Mediator** | how and which objects interact with each other | To define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.
**Memento** | what private information is stored outside an object, and when | To capture and externalize an object's internal state so that the object can be restored to this state later, _without_ breaking encapsulation.
**Observer** | number of objects that depend on another object; how the dependent objects stay up to date | To define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
**State** | internal states of an object  | To allow an object to alter its behavior when its internal state changes. The object will appear to change its class.
**Strategy** | an algorithm | To define a family of algorithms, encapsulate each one, and make them interchangable. Strategy also lets the algorithm vary independently from the clients that use it.
**Visitor** | operations that can be applied to object(s) without changing their class(es) | To request an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates.

## Summary

- **TODO**