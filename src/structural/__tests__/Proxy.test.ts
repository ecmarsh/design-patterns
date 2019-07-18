import {
  Balancer, // Proxy
  responses // Helper data
} from '../Proxy'

describe('Proxy', () => {
  let website: Balancer

  beforeEach(() => {
    website = new Balancer()
  })

  test('Get', () => {
    expect(website.get('/index', 'Northern Cal').content).toMatch(/norcal/i)
    expect(website.get('/index', 'Southern Cal').content).toMatch(/socal/i)
    expect(website.get('/notreal', 'norcal')).toMatchObject(responses().notFound)
  })

  test('Post', () => {
    const newURL = '/new',
      newContent = 'new page',
      pageData = { [newURL]: newContent },
      location = 'norcal'

    expect(website.get(newURL, location)).toMatchObject(responses().notFound)
    website.post('/newpage', pageData, location)
    expect(website.get(newURL, location)).toMatchObject(responses(newContent).ok)
  })

  test('Not Allowed', () => {
    expect(website.post('/notreal', { fake: 'data' }, 'socal'))
      .toMatchObject(responses().notAllowed)
  })
})
