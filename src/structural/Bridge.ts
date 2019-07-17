/**
 * BRIDGE (Handle/Body)
 *
 * -----------
 * Usage:
 * when you want to avoid a permanent binding between an abstraction and its implementation
 * when both abstractions and implementations should be independently extensible by subclassing
 * you don't want to affect clients when changing implementation of an abstraction
 * you want to hide implementation of abstraction completely from clients
 * you have a highly-nested tree-like hierarchy
 * you want to share an implementation among multiple objects but the client shouldn't know about this sharing
 *
 *
 * -----------
 * Consequences:
 * + Decouples interface and implementation, encouraging layering for a better-structured system.
 * + Improved extensibility with independent hierarchy extension.
 * + Hiding implementation details from clients.
 *
 * Note: If there's only one implementation, creating an abstract Implementor class isn't necessary. There's a one-to-one relationship between Abstraction and Implementor.
 */

// ABSTRACTION
// Defines the abstraction's interface.
// Maintains a reference to an object of type Implementor.
interface Abstraction {
  getPayment(): number
}

class Payment implements Abstraction {
  private markupRate = 1

  public constructor(
    private principal: number,
    private payment: Implementor
  ) { }

  public getPayment = (): number => this.calcBasePayment()

  protected calcBasePayment = (): number => {
    const periods = this.payment.getPeriods(),
      baseRate = this.payment.getRate(),
      rate = this.applyInterest(baseRate)

    return this.principal * rate / periods | 0
  }

  private applyInterest = (baseRate: number) => baseRate + this.markupRate
}

// REFINED ABSTRACTION (optional)
// Extends the interface defined by Abstraction.
interface RefinedAbstraction extends Abstraction {
  chargeLateFee(payment: number): number
}

class LatePayment extends Payment implements RefinedAbstraction {
  public constructor(principal: number, payment: Implementor) {
    super(principal, payment)
  }

  public getPayment = () => this.chargeLateFee(this.calcBasePayment())

  public chargeLateFee = (payment: number): number => payment << 1
}


// IMPLEMENTOR<I>
// Defines interface for implementing classes.
// Typically the impl interface provides only primitive operations,
// and Abstraction defines higher-level ops based on these primitives.
interface Implementor {
  getRate(): number
  getPeriods(): number
}


// CONCRETE IMPLEMENTOR
// Implements the Implementor interface
// and defines its concrete implementation.
class CarPayment implements Implementor {
  constructor(
    private creditScore: number,
    private periodsMonths: number,
  ) { }

  private dealerRateMarkup = 1

  public getRate = (): number => getRate(this.creditScore) + this.dealerRateMarkup

  public getPeriods = (): number => this.periodsMonths
}

class Mortgage implements Implementor {
  constructor(
    private owner1Score: number,
    private owner2Score: number,
    private periodMonths: number,
  ) { }

  public getRate = (): number => {
    return (getRate(this.owner1Score) + getRate(this.owner2Score)) >> 1
  }

  public getPeriods = (): number => this.periodMonths
}

// Common shared helper, unknown to client
function getRate(creditScore: number) {
  switch (creditScore) {
    case 800: return 2
    case 700: return 3
    case 600: return 4
    case 500: return 5
    default: return 6
  }
}


// CLIENT
// Requests using Abstraction Interface
// which forwards requests to Implementor object.
interface Client { payment: Abstraction }

class Bank implements Client {
  private bankAmount = 10000
  public constructor(public payment: Abstraction) { }
  public charge = () => this.bankAmount -= this.payment.getPayment()
}


export { Bank, Payment, LatePayment, CarPayment, Mortgage }