/**
 * CLASS ADAPTER (Wrapper)
 * Uses multiple inheritance to adapt one interface to another.
 *
 * ------------
 * Usage:
 * to use an existing class with an interface that doesn't match
 * to create a reusable class that cooperates with incompatible interfaces
 *
 *
 * -----------
 * Consequences:
 * + adapter can override some of adaptee's behavior since adapter is a subclass of adaptee
 * + good for space since introduces only one object, without the need for an additional pointer to get the adaptee
 * - won't work when we want to adapt a class and ALL its subclasses
 *
 */


/**
 * **Target:**
 * Defines the domain-specific interface that Client uses.
 */
interface Target {
  getNumbers(): number[]
}


/**
 * _Client_
 * Collaborates with objects conforming to the target interface.
 * Calls operations on adapter instance which is passed to adaptee.
 */
class Aggregator {
  static sum = (collection: Target) => {
    const data = collection.getNumbers()
    return data.reduce((prev, curr) => prev + curr)
  }
}


/**
 * **Adaptee:**
 * Defines an existing interface that needs adapting.
 */
interface Adaptee {
  getWord(): string
}

class Word implements Adaptee {
  constructor(private word: string) { }
  public getWord = () => this.word
}


/**
 * **Adapter:**
 * Adapts the interface of Adaptee to target interface.
 * Class: Inherit targets interface and adaptees implementation.
*/
class WordAdapterForAggregator extends Word implements Target {
  public getNumbers = (): number[] => {
    const word = this.getWord()
    const numbers = this.adapt(word)
    return numbers
  }

  private adapt = (word: string): number[] => {
    const toUTF16 = (char: string) => char.charCodeAt(0)
    return [...word].map(toUTF16)
  }
}


export { Aggregator, WordAdapterForAggregator }