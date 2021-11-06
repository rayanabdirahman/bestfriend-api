interface RandomColor {
  generate(): string;
}

enum ColorHex {
  GREEN = '96CDC0',
  PINK = 'EFD1D1',
  RED = 'FF5555',
  BLUE = '5982EF',
  YELLOW = 'F2C95F'
}

const MappingNumberToColorHex: { [key: number]: string } = {
  1: ColorHex.GREEN,
  2: ColorHex.PINK,
  3: ColorHex.RED,
  4: ColorHex.BLUE,
  5: ColorHex.YELLOW
};

const RandomColor: RandomColor = {
  generate(): string {
    const numberOfColors = Object.keys(MappingNumberToColorHex).length;
    // return number between 1 - numberOfColors length
    const randomNumber = Math.floor(Math.random() * numberOfColors) + 1;
    return MappingNumberToColorHex[randomNumber];
  }
};

export default RandomColor;
