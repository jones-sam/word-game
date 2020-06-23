import keygen from "keygenerator"

export const generateLetters = (numOfLetters) => {
  return keygen
    ._({
      forceUppercase: true,
      length: numOfLetters,
      numbers: false,
    })
    .split("")
}
