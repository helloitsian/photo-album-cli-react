import { useCallback, useContext, useEffect } from 'react';
import { TerminalContext } from '../contexts/TerminalContext';

const Terminal = () => {
  const terminalState = useContext(TerminalContext);

  const handleTerminalCommand = useCallback(async () => {
    const currentKeyString = terminalState.state.keyString;
    const commandData = currentKeyString.replace('\n', ' ').split(' ');
    const commandRules = terminalState.state.commands;
    
    if (commandRules) {
      const commandLabel = commandData[0];
      const commandRule = commandRules[commandLabel];

      /* if we have a rule for this command, parse args and execute command. 
         then push output to outputs array */
      if (commandRule) {
        const commandArgs = commandRule.parseArgs(commandData);
        const output = await commandRule.execute(commandArgs, terminalState.dispatch);
        if (output) {
          terminalState.dispatch({
            type: 'add-output',
            data: output,
          })

          const terminalOutputEl = document.querySelector('pre');
          terminalOutputEl.scrollTop = terminalOutputEl.scrollHeight;
        }
      }
    } 
  })

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        handleTerminalCommand();
      }

      terminalState.dispatch(e);
    };

    document.addEventListener("keydown", keyDownHandler);
    // cleanup listener to prevent multiple events/memory leaks
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [handleTerminalCommand]);

  return (
    <div class="terminal-wrap">
    <pre>
      { terminalState.state.outputs.map((output) => output + '\n')}
      { '> ' }
      {0 === terminalState.state.cursorLocation ? <div id="cursor"></div> : null }
      {
        terminalState.state.keyString.split('').map((letter, index) => {
          return (
            <>
              {index !== 0 && index === terminalState.state.cursorLocation ? <div id="cursor"></div> : null }
              {letter || ''}
            </>
          )
        })
      }
      {terminalState.state.cursorLocation !== 0 && terminalState.state.keyString.length === terminalState.state.cursorLocation ? <div id="cursor"></div> : null }
    </pre>
    </div>
  )
}

export default Terminal;