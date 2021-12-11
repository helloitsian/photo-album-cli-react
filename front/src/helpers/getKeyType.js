const getKeyType = (keyCode) => {
  const isSpace = keyCode === 32;
  const isReturn = keyCode === 13;
  const isBackspace = keyCode === 8;

  const isInLetterRange = keyCode >= 65 && keyCode <= 90;
  const isInNumberRange = keyCode >= 48 && keyCode <= 57;
  const isInSymbolRange =
    (keyCode >= 48 && keyCode <= 57) ||
    (keyCode >= 106 && keyCode <= 111) ||
    (keyCode >= 186 && keyCode <= 222);
  
  if (isSpace) {
    return "space";
  } else if (isReturn) { 
    return "command";
  } else if (isBackspace) {
    return "backspace";
  } else if (isInLetterRange) {
    return "letter";
  } else if (isInNumberRange) {
    return "number";
  } else if (isInSymbolRange) {
    return "symbol";
  } else {
    return "command";
  }
};

export default getKeyType;