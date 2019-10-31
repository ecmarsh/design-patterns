import { BSTCollection, traverse } from '../Iterator'

describe('Iterator', function testIterator() {
  test('Traversal with iterator interface', () => {
    const data = [3,2,1,5,6,8,10,11,2,1,10,9,7]
    const bst = new BSTCollection(data)
    const iter = bst.createIterator()

    const treeData = traverse(iter) // traverse uses iterator interface
    expect(treeData).toBeTruthy() // ensure FAIL if void data

    // should perform successful inorder traversal of bst using iterator
    const sortedAsc = data.slice().sort((a, b) => a - b)
    sortedAsc.forEach(
      (sortedVal: number|void, i: number) => {
        expect(sortedVal).toEqual(treeData[i])
      }
    )
  })
})