import { TransparentColor, HexAdapter } from '../ObjectAdapter'

const color = {
  hex: '#FFFFFF',
  rgb: [255, 255, 255],
  opacity: .5,
}

test('Object Adapter', () => {
  const { hex, rgb, opacity } = color,
    adaptedHexColor = new HexAdapter(hex),
    transparentColor = new TransparentColor(adaptedHexColor, opacity),
    rgba = new RegExp(`^rgba.*${rgb}.*${opacity}.*$`, 'i')

  expect(transparentColor.createRgba()).toMatch(rgba)
})