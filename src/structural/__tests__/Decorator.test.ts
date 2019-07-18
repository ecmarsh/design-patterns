import { Cart, Item, WithTenBucksShipping, WithFiveBuckDiscount } from '../Decorator'

describe('Decorator', function testDecorator() {
  test('Cart', () => {
    const cart: Cart = new Cart()
    expect(cart.getOrderPriceUSD()).toEqual(0)
  })

  test('Add items to cart', () => {
    const cart: Cart = new Cart()
    const shoes: Item = new Item('shoes', 20)
    shoes.addToCart(cart)
    expect(cart.getOrderPriceUSD()).toEqual(20)
  })

  describe('Shipping decoration', () => {
    const cart: Cart = new Cart(),
      shoes: Item = new Item('shoes', 20),
      expeditedShoes = new WithTenBucksShipping(shoes)

    test('Decoration adds shipping cost', () => {
      expeditedShoes.addToCart(cart)
      expect(cart.getOrderPriceUSD()).toEqual(20 + 10)
    })
    test('Decoration side effects', () => {
      expect(shoes.priceUSD).toEqual(20)
    })
  })

  test('Discount decoration', () => {
    const cart: Cart = new Cart(),
      shoes: Item = new Item('shoes', 20),
      discountedShoes = new WithFiveBuckDiscount(shoes)
    discountedShoes.addToCart(cart)
    expect(cart.getOrderPriceUSD()).toEqual(20 - 5)
  })

  test('Composed decoration', () => {
    const cart: Cart = new Cart(),
      shoes: Item = new Item('shoes', 20),
      expeditedShoes = new WithTenBucksShipping(shoes),
      discountedExpeditedShoes = new WithFiveBuckDiscount(expeditedShoes)
    discountedExpeditedShoes.addToCart(cart)
    expect(cart.getOrderPriceUSD()).toEqual(20 + 10 - 5)
  })
})