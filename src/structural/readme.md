# Structural

Concerned with how classes and objects are composed to form larger structures.

## Class Patterns

Structural class patterns use **inheritance to compose classes**:

Name | Varying Aspect | Intent
---- | -------------- | ------
**Adapter (Cls)** | interface to a class | To convert the interface of a class/obj into another interface clients expect. Adapter lets objects work together that couldn't otherwise because of incompatible interfaces.

## Object Patterns

Structural object patterns describe **ways to assemble (compose) objects** to allow for more flexibility:

Name | Varying Aspect | Intent
---- | -------------- | ------
**Adapter (obj)** | interface to an object | To convert the interface of a class/obj into another interface clients expect. Adapter lets objects work together that couldn't otherwise because of incompatible interfaces.
**Bridge** | implementation of an object | To decouple an abstraction from its implementation so that the two can vary independently.
**Composite** | structure and composition of an object | To compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.
**Decorator** | responsibilities of an object without subclassing | To attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclasses for extending functionality.
**Facade** | interface to a subsystem | To provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.
**Flyweight** | storage costs of objects | To use sharing to support large numbers of fine-grained objects efficiently.
**Proxy** | how an object is acccessed; its location | To provide a surrogate or placeholder for another object to control access to it.

## Summary

Structural patterns are often related, especially in their participants and collaborations due to reliance on language mechanisms. Although related, their intents are quite different.

## Comparisons

### Adapter v Bridge

#### Similarities

Both promote flexibility by providing a level of indirection to another object by forwarding requests to that object from an interface other than its own.

#### Differences

- Adapter focuses on resolving incompatibilities between two existing interfaces in order to make two independently designed classes work together without reimplementation.

- Bridge intent is to bridge an abstraction and its potentially numerous implementations by providing a stable interface to clients. It lets you vary the classes that implement the interface and accomadates new implementations as the system evolves.

- **Chronilogically**, Adapter makes things work after they're designed while Bridge makes them work before.

#### Adapter is not a Facade

Adapter reuses an old interfaces while Facade defines a new one.

### Composite v Decorator

#### Similarities

Composite and Decorator both rely on recursive composition to organize an open-ended number of objects. Both lead to a pluggable architecture. They can, but are not required, to be used together.

#### Differences

- From the POV of the Composite pattern, a decorator is a Leaf, and from the POV of the Decorator, a composite is a concrete component.

- Decorator focuses on embellishment, letting you add responsibility to objects without subclassing.

- Composite focuses on representation and structuring classes so that multiple objects can be treated uniformly and ultimately as one object.

### Decorator v Proxy

#### Similarities

Both describe how to provide a level of indirection to an object. The implementations of both the proxy and decorator object keep a reference to another object to which they forward requests.

#### Differences

- Decorator is concerned with attaching/detaching properties dynamically and is designed for recursive composition. Proxy is not.

- Proxy composes an object and provides an identifical interface to clients. Its intent is to provide a stand-in for a subject when it is inconvenient or undeisrable to access the subject directly (e.g when it's on a remote machine, has restricted access, or is persistent)

- In Decorator, components provides only part of the functionality using one or more decorators to furnish the rest for situations where an objects total functionality can't be conveniently determined at compile time.

- Proxy focuses on one relationship (between proxy and its subject) that can be dynamically expressed. The subject defines the key functionality and proxy grants or refuses access to it.

- While it may be tempting to use hybrid proxy-decorators or decorator-proxies, keeping them divisible will prove most reusable.
