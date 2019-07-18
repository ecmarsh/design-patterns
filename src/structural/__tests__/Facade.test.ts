import * as Scripts from '../Facade'


describe('Facade', function testFacade() {

  test('Run dev', () => {
    const scripts = new Scripts.default()
    const devServer = jest.spyOn(Scripts.DevServer, 'getURL')
    const config = scripts.runDev()
    expect(config).toHaveProperty('es', 9)
    expect(config.styles).toMatch(/css/i)
    expect(devServer).toHaveBeenCalled()
    devServer.mockRestore()
  })

  test('Run Prod', () => {
    const scripts = new Scripts.default()
    const prodServer = jest.spyOn(Scripts.ProdServer, 'getURL')
    const config = scripts.runProd()
    expect(config).toHaveProperty('es', 5)
    expect(config.styles).toMatch(/processed/i)
    expect(prodServer).toHaveBeenCalled()
    prodServer.mockRestore()
  })

})