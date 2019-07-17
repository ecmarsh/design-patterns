import { WordAdapterForAggregator, Aggregator } from '../ClassAdapter'

test('Class Adapter', () => {
  const adaptedWord = new WordAdapterForAggregator(`DATA`)
  // UTF-16 (using only the ASCII part):
  //   D: 68
  // + A: 65 = 133
  // + T: 84 = 217
  // + A: 65 = **282**
  const aggregated = Aggregator.sum(adaptedWord)
  expect(aggregated).toEqual(282)
})