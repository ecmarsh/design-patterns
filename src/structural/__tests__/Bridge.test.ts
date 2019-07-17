import {
  Bank, // Client
  Payment, // Abstraction
  LatePayment, // Refined Abstraction
  CarPayment, // Concrete1
  Mortgage, // Concrete2
  getRate, // Concrete shared helper
} from '../Bridge'


let carPayment: CarPayment
let mortgage: Mortgage

beforeEach(() => setupTestUtils())

describe('Bridge', () => {
  test('Get rate', () => {
    expect(getRate(800)).toEqual(2)
    expect(getRate(700)).toEqual(3)
    expect(getRate(600)).toEqual(4)
    expect(getRate(500)).toEqual(5)
  })

  test('Concrete 2 - Car Payment', () => {
    expect(carPayment.getRate()).toEqual(5)
    expect(carPayment.getPeriods()).toEqual(car().periodsMonths)
  })

  test('Concrete1 - Mortgage', () => {
    expect(mortgage.getRate()).toEqual(3)
    expect(mortgage.getPeriods()).toEqual(home().periodsMonths)
  })

  test('Payment Abstraction with Car', () => {
    const abstractPayment = new Payment(car().price, carPayment)
    const payment = abstractPayment.getPayment()
    expect(payment).toEqual(1000)
  })

  test('Payment Abstraction with Mortgage', () => {
    const abstractPayment = new Payment(home().price, mortgage)
    const payment = abstractPayment.getPayment()
    expect(payment).toEqual(10000)
  })

  test('Refined Payment Abstraction', () => {
    const refinedAbstractPayment = new LatePayment(car().price, carPayment)
    const lateDoublePayment = refinedAbstractPayment.getPayment()
    expect(lateDoublePayment).toEqual(2000)
  })

  test('Client usage', () => {
    const payment = new Payment(car().price, carPayment)
    const bank = new Bank(payment)
    expect(bank.charge()).toEqual(9000)
  })
})


// TEST UTILS
function setupTestUtils() {
  const { ccScore, periodsMonths } = { ...car() }
  carPayment = new CarPayment(ccScore, periodsMonths)

  const { score1, score2, periodsMonths: periods } = { ...home() }
  mortgage = new Mortgage(score1, score2, periods)
}

function car() {
  return {
    ccScore: 600,
    periodsMonths: 60,
    price: 10000,
  }
}

function home() {
  return {
    score1: 800,
    score2: 600,
    periodsMonths: 40,
    price: 100000
  }
}