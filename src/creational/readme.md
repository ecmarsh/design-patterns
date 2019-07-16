# Creational

Provide flexibility in what gets created, who creates it, how it gets created, and when.

## Class Patterns

Creational class patterns defer some part of object creation **to subclasses**:

Name | Varying Aspect | Intent
---- | -------------- | ------
**Factory Method** | subclass of object that is instantiated | To define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

## Object Patterns

Creational object patterns defer object creation **to another object**:

Name | Varying Aspect | Intent
---- | -------------- | ------
**Abstract Factory** | families of product objects | To provide interface for creating families of related or dependent objects without specifying their concrete classes.
**Builder** | how a composite object gets created | To separate the construction of complex objects from its representation so that the same construction process can create different representations.
**Prototype** | class of object that is instantiated | Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.
**Singleton** | the sole instance of a class | To ensure a class only has one instance, and provide a global point of access to it.

## Summary

Each design has its trade offs, but the most flexible is typically the Prototype pattern. Often designs start out using Factory Method and evolve towards one of the other creational patterns as areas where flexibility is needed are revealed.

### Ways To Create Objects

1. Inheritance: Subclass the class that creates the object (Factory Method). Keep in mind changes can cascade since this approach requires creating a new subclass just to change the class of a product. Avoid deep inheritance trees.

2. Composition: Define an object that knows the common interface of product objects and make it a parameter of the system (Abstract Factory, Builder, Prototype).

   - Abstract factory has the factory object producing objects of several classes.

   - Builder has the factory object building a complex product incrementally using a corresponding complex protocol (one provides steps to building, one implements actual steps).

   - Prototype has the factory object building a product by copying a prototype object, and the factory object and the prototype are the same (products can clone themselves).
