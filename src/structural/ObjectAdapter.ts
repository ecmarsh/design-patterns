/**
 * OBJECT ADAPTER (Wrapper)
 * Relies on object composition to adapt parent class interface.
 *
 * ------------
 * Usage:
 * to use several existing incompatible subclasses by adapting the interface of its parent class
 *
 * -----------
 * Consequences:
 * + a single adapter can work with the adaptee and all of its subclasses
 * + a single adapter can add functionality to the adaptee and subclasses
 * - overriding adaptee behavior is harder because it requires subclassing adaptee and making adapter refer to the subclass rather than the adaptee itself
 *
 */

// TARGET<I>
// Defines the domain-specific interface that Client uses.
interface RGBColor {
  getTriple(): RGB
}

type RGB = [number, number, number] // ex: [255, 255, 255]


// CLIENT
// Collaborates with objects conforming to the target interface.
// Calls operations on adapter instance which is passed to adaptee.
interface Client {
  createRgba(): RGBa
}

type RGBa = string // ex: "rgba(255,255,255,0.8)"

class TransparentColor implements Client {
  constructor(private rgb: RGBColor, private opacity: number) { }

  createRgba = (): string => {
    return `rgba(${this.rgb.getTriple()}, ${this.opacity})`
  }
}


// ADAPTEE
// Defines an existing interface that needs adapting.
interface Adaptee {
  getHex(): Hex
}

type Hex = string // ex: '#FFFFFF'

class HexColor implements Adaptee {
  constructor(private hex: Hex) { }
  public getHex = () => this.hex
}


// ADAPTER
// Adapts the interface of Adaptee to target interface.
// Object adapter composes the adaptee instance internally
// and implements in terms of target interface.
class HexAdapter implements Adaptee, RGBColor {
  private hexColor: Adaptee

  constructor(private hex: Hex) {
    this.hexColor = new HexColor(hex)
  }

  public getTriple = (): RGB => this.convertHexToRgb(this.getHex())

  public getHex = () => this.hexColor.getHex()

  private convertHexToRgb = (hex: string) => {
    const chunk = 2,
      radix = 16,
      rgb: number[] = []

    let i = 1 // Skip leading hash `#`
    while (hex && i < hex.length) {
      rgb.push(parseInt(hex.substring(i, i + chunk), radix))
      i += chunk
    }

    return rgb as RGB
  }
}

export { HexAdapter, TransparentColor }