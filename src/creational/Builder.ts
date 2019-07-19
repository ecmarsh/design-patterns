/**
 * BUILDER
 *
 * --------
 * Usage:
 * to separate algorithm for creating a complex object how the object pars are made
 * to allow different representations/configurations of the object
 *
 *
 * ---------
 * Consequences:
 * + Can vary the representation by defining a new kind of builder.
 * + Isolates construction code and representation code.
 *
 */


/**
 * **Builder:**
 * Specifies an abstact interface
 * for creating parts of a Product object
 */
interface ElementBuilder {
  startElement(...args: any[]): void
  addAttribute(descriptor: AttrDescriptor): void
  addChildren(...children: any[]): void
  finishElement(): void
  reset(): void
}

interface AttrDescriptor {
  attr: string
  val: string
}


/**
 * **Concrete Builder:**
 * Constructs and assembles parts of product
 * by implementing the Builder interface
 * Defines and tracks representation it creates
 * Provides interface for retrieving product
 */
class TitleBuilder implements ElementBuilder {
  private element: string = ''
  private size: number = 1

  public getElement = () => this.element

  public startElement = (size: number) => {
    this.size = size
    this.element = `<h${size}>`
  }

  public addAttribute = ({ attr, val }: AttrDescriptor) => {
    this.trimLastChar()
    this.element += ` ${attr}="${val}">`
  }

  public addChildren = (text: string) => {
    this.element += text
  }

  public finishElement = () => {
    this.element += `</h${this.size}>`
  }

  public reset = () => {
    this.element = ''
    this.size = 1
  }

  protected trimLastChar = () => {
    this.element =
      ''.substring.call(this.element, 0, this.element.length - 1)
  }
}


/**
 * **Director:**
 * Constructs an object using Builder interface
 */
class ElementDirector {
  constructor(public builder: ElementBuilder) { }

  public makeTitle(type: string) {
    this.builder.reset()
    const { size, desc, text } = this.makeConfig(type.toLowerCase())
    this.builder.startElement(size)
    this.builder.addAttribute(desc)
    this.builder.addChildren(text)
    this.builder.finishElement()
  }

  makeConfig = (type: string) => {
    const config = {
      size: 1,
      desc: { attr: 'id', val: 'default' },
      text: '',
    }

    switch (type) {
      case 'headline': {
        config.desc.attr = 'class'
        config.desc.val = 'fancy'
        config.text = 'HEADLINE!'
        break
      }
      case 'subheader': {
        config.size = 2
        config.desc.attr = 'style'
        config.desc.val = 'font-style:italic'
        config.text = 'Subheader'
        break
      }
      case 'skiplink': {
        config.size = 4
        config.desc.val = 'section'
        config.text = 'Section title'
        break
      }
      default: return config
    }

    return config
  }
}


/**
 * **[Product(s)]:**
 * Represents complex object under construction
 * Concrete Builder builds product's internal
 * representation and defines assembly process.
 * Typically this _isn't_ needed, but could
 * be a summary of getting / setting done by builder
 * and controlled by director.
 */
class TitleElementProduct {
  constructor(
    public element: string,
    public size: number
  ) { }
}


/**
 * _Client_
 * Can control builds through director
 * retrieve products from the builder
 */
function clientExample() {
  // Initialize
  const builder = new TitleBuilder()
  const director = new ElementDirector(builder)

  // Direct and different title configurations
  director.makeTitle('headline')
  const headline = builder.getElement()
  render(headline)

  function render(element: string) {
    console.log(element)
  }
}


export { ElementDirector, TitleBuilder }
