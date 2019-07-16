# Creational Patterns

Provide flexibility in what gets created, who creates it, how it gets created, and when.

## Class Patterns

Creational class patterns defer some part of object creation to subclasses.

Name | Varying Aspect | Intent
---- | -------- | ------
**Factory Method** | subclass of object that is instantiated | To define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

---

## Object Patterns

Creational object patterns defer object creation to another object.

Name | Varying Aspect | Intent
---- | -------- | ------
**Abstract Factory** | families of product objects | To provide interface for creating families of related or dependent objects without specifying their concrete classes.
**Builder** | how a composite object gets created | To separate the construction of complex objects from its representation so that the same construction process can create different representations.
**Prototype** | class of object that is instantiated | Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.
**Singleton** | the sole instance of a class | To ensure a class only has one instance, and provide a global point of access to it.