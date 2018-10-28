# VCR for API calls

This module is for recording and playing back remote API calls
It is an express server that listens to requests and has three modes:

RECORD: it receives the request, copies it, and makes the same request to a remote server. When it receives the response from the remote server, it saves the request and the response in the `recordings` folder, and then sends back the response to the original caller.

PLAYBACK: it receives the request and looks for it in the saved ones it has in the `recordings` folder. If it finds a recording that corresponds, it returns the recorded response to the original caller. If it doesn't find a matching request in its saved recordings, it returns a 403.

CACHE: it receives the request and looks for it in the saved requests it has in the `recordings` folder. If it finds a recording that corresponds, it returns the recorded response to the original caller. If it doesn't find a matching request in its saved recordings, it makes the request to the remote server and then saves the request and the response it receives in the `recordings` folder, and then it sends back the response to the original caller.

In `config.js` is where you set the basic configuration for the recorder:<br>
  `remoteUrl`: the URL of the remote server, including its port<br>
  `dir`: the name of the directory where the recordings will be saved<br>
  `defaultMode`: if a mode isn't specified on the command line, you can specify a default here<br>
  `port`: the port that the vcr listens on

