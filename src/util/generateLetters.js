import keygen from "keygenerator"

export const generateLetters = (numOfLetters) => {
  let letters
  do {
    letters = keygen._({
      forceUppercase: true,
      length: numOfLetters,
      numbers: false,
    })
  } while (/[AEIOU]/.test(letters) === false)

  return letters.split("")
}
