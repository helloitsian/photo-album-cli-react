import { createContext, useReducer  } from "react";
import getKeyType from "../helpers/getKeyType";

const TerminalContext = createContext();

function removeCharAtIndex(str, index) {
  return str.slice(0,index) + str.slice(index+1);
}

function addCharAtIndex(str, index, char) {
  return str.slice(0,index) + char + str.slice(index);
}

const handleArrowLeft = (state, keyEvent) => {
  return {
    ...state,
    ...keyEvent,
    cursorLocation: state.cursorLocation <= 0 
      ? 0
      : state.cursorLocation - 1,
  }
}

const handleArrowRight = (state, keyEvent) => {
  return {
    ...state,
    ...keyEvent,
    cursorLocation: state.cursorLocation <= state.keyString.length - 1
      ? state.cursorLocation + 1
      : state.keyString.length,
  }
}

const handleBackspace = (state, keyEvent) => {
  return {
    ...state,
    ...keyEvent,
    keyString: removeCharAtIndex(state.keyString, state.cursorLocation - 1),
    cursorLocation: state.cursorLocation <= 0 
      ? 0
      : state.cursorLocation - 1,
  }
}

const handleEnterCommand = (state, keyEvent) => {
  // clear console input and reset cursor
  return {
    ...state,
    ...keyEvent,
    cursorLocation: 0,
    keyString: "",
  }
}

// handles shift + enter add a new line
const handleNewLine = (state, keyEvent) => ({
  ...state,
  ...keyEvent,
  keyString: addCharAtIndex(state.keyString, state.cursorLocation, '\n')
})

const handleCopy = (state, keyEvent) => state;
const handlePaste = (state, keyEvent) => state;

const handleKeyCommand = (state, keyEvent) => {
  const { key, ctrlKey, shiftKey } = keyEvent;
  
  switch(key) {
    case 'v':
      if (ctrlKey)
        return handlePaste(state, keyEvent);
    break;
    case 'c':
      if (ctrlKey)
        return handleCopy(state, keyEvent);
    break;
    case 'Enter':
      if (shiftKey)
        return handleNewLine(state, keyEvent);
      else
        return handleEnterCommand(state, keyEvent);
    default:
      return state;
  }
}

const outputsReducer = (state, action) => {
  if (action.type === 'add-output') {
    return {
      ...state,
      outputs: [ ...state.outputs, action.data]
    }
  }
  if (action.type === 'clear-outputs') {
    return {
      ...state,
      outputs: [],
    }
  }
}

const keyEventReducer = (state, action) => {
  const keyType = getKeyType(action.keyCode);
  // grab key event data because we can't spread them
  const keyEvent = {
    key: action.key,
    keyCode: action.keyCode,
    shiftKey: action.shiftKey,
    ctrlKey: action.ctrlKey,
    altKey: action.altKey,
  }
  // decide if we should print key to console
  const printToConsole = (
    (keyType === "symbol" ||
      keyType === "letter" ||
      keyType === "number" ||
      keyType === "space") &&
    !keyEvent.ctrlKey &&
    !keyEvent.altKey
  );

  if (action.key === 'ArrowLeft') {
    return handleArrowLeft(state, keyEvent);
  } else if (action.key === 'ArrowRight') {
    return handleArrowRight(state, keyEvent);
  } else if (keyType === 'backspace') {
    return handleBackspace(state, keyEvent);
  } else if (keyType === 'command') {
    return handleKeyCommand(state, keyEvent);
  }

  if (printToConsole)
    return {
      ...state,
      ...keyEvent,
      keyString: addCharAtIndex(state.keyString, state.cursorLocation, action.key),
      cursorLocation: state.cursorLocation + 1,
    }
}

const terminalReducer = (state, action) => {
  return (
    outputsReducer(state, action) 
    || keyEventReducer(state, action) 
    || state
  );
}

const TerminalProvider = ({
  commands={},
  children,
}) => {
  const [state, dispatch] = useReducer(terminalReducer, {
    outputs: [],
    keyString: '',
    cursorLocation: 0,
    commands,
  });

  return (
    <TerminalContext.Provider value={{ state, dispatch }}>
      {children}
    </TerminalContext.Provider>
  );
}

export {
  TerminalContext,
  TerminalProvider,
}