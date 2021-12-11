import axios from 'axios';
import { TerminalProvider } from "./contexts/TerminalContext";
import Terminal from './components/Terminal';

import dedent from 'dedent-js';
import './index.css';

export default function App() {
  const commands = {
    'hello': {
      parseArgs: () => ({}),
      execute: () => "world!",
    },
    'help': {
      parseArgs: () => ({}),
      execute: () => dedent(`
        Avaliable Commands:
        help
        \tlists commands and their uses
        clear
        \tclears terminal output
        
        getallphotos
        \t Fetches all photos

        getphotos [PROP: (albumId, id, title, url, thumbnailUrl)] [PROP_VALUE] [RESULTS_LIMIT]
        \t== Arguments ==
        \tPROP: albumId, id, title, url, thumbnailUrl
        \tPROP_VALUE: any
        \tRESULTS_LIMIT: number (defaults to 20)

        \tFetches photos with given filter. 
        \tExample: \`get albumId 1 10\`, returns 10 photos from albumId 1.
      `)
    },
    'getallphotos': {
      parseArgs: () => ({}),
      execute: async (args) => {
        try {
          let endpointQuery = `http://localhost:8000/photos`;

          const photos = await axios(endpointQuery, { mode: 'no-cors' })

          if (photos.success)
            return JSON.stringify(photos.data.message, null, 2)
          return JSON.stringify(photos, null, 2);
        } catch(err) {
          console.log(err);
          return JSON.stringify({
            success: false,
            message: err,
          }, null, 2)
        }
      },
    },
    'getphotos': {
      parseArgs: (args) => ({
        prop: args[1],
        value: args[2],
        limit: args[3] || 20,
      }),
      execute: async (args) => {
        try {
          let endpointQuery = `http://localhost:8000/photos`;
          if (args.prop && args.value) {
            endpointQuery += `?${args.prop}=${args.value}`
          }

          const photos = await axios(endpointQuery, { mode: 'no-cors' })

          if (photos.success)
            return JSON.stringify(photos.data.message.slice(0, args.limit), null, 2)
          return JSON.stringify(photos, null, 2);
        } catch(err) {
          console.log(err);
          return JSON.stringify({
            success: false,
            message: err,
          }, null, 2)
        }
      }
    },
    'clear': {
      parseArgs: () => ({}),
      execute: (_args, dispatch) => dispatch({ type: 'clear-outputs' }),
    }
  }

  return (
    <TerminalProvider commands={commands}>
      <div class="container">
        Type 'help' to get started
        <Terminal></Terminal>
      </div>
    </TerminalProvider>
  );
}