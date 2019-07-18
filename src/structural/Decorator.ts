/**
 * DECORATOR (Wrapper)
 *
 * -------------
 * Usage:
 * to add responsibilities to indivudal objects without affecting other objects
 * to add responsibilities that can be easily withdrawn
 * when you want to add a similar combination of realted functionality and extension by subclassing to fit all of these features is impractical or subclassing is just unavailable
 *
 * -------------
 * Consequences:
 * + More flexibility than static (multiple) inheritance
 * + Avoids feature-laden classes high up in hierarchy
 * - Decoratated component != component
 * - Often results in lots of little objects that all look similar, but aren't.
 *
 * Important: Decorators should *only* change the "skin" of an object, not the "guts". Use Strategy behavioral pattern to change the "guts".
 *
 */

// COMPONENT
// Defines interface for objects that can be decorated.
interface Component {
  priceUSD: number
  addToCart(cart: Cart): void
}

// CONCRETE COMPONENT
// The actual object that can be decorated.
class Item implements Component {
  constructor(
    public name: string,
    public priceUSD: number
  ) { }

  public addToCart(cart: Cart) {
    cart.add(this)
  }
}

// DECORATOR
// Maintains reference to Component object and
// defines an interface that conforms to Component's interface.
abstract class Decorator implements Component {
  abstract addExtra(price: number): number

  constructor(private component: Component) { }

  public get priceUSD() {
    return this.addExtra(this.component.priceUSD)
  }

  public addToCart = this.component.addToCart
}

// CONCRETE DECORATOR
// Adds responsibilities to the component
class WithTenBucksShipping extends Decorator {
  constructor(component: Component) {
    super(component)
  }
  public addExtra(price: number) {
    return price + 10
  }
}

class WithFiveBuckDiscount extends Decorator {
  constructor(component: Component) {
    super(component)
  }
  public addExtra(price: number) {
    return price - 5
  }
}

// Client/Testing
class Cart {
  private items: Component[] = []

  public add(item: Component) {
    this.items.push(item)
  }

  public getOrderPriceUSD() {
    let orderPriceUSD = 0
    this.items.forEach(item => {
      orderPriceUSD += item.priceUSD
    })
    return orderPriceUSD
  }
}


export { Cart, Item, WithTenBucksShipping, WithFiveBuckDiscount }