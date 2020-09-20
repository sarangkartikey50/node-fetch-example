# Fetch ([link](https://javascript.info/fetch))

```javascript
let promise = fetch(url, options);
```

`Without options, it's a simple GET request`

1. First, the promise, returned by fetch, resolves with an object of the built-in Response class as soon as the server responds with headers.

2. We can check the http status using `status` (status codes) or `ok` boolean property.

```javascript
const response = await fetch(url);
if (response.ok) {
  const json = await response.json();
} else {
  console.error(`http error: ${response.status}`);
}
```

3. Response provides multiple promise-based methods to access the body in various formats:

a. response.text() - read the response and return as text
b. response.json() - read the response and return as json
c. response.formData() - read the response and return FormData object
d. response.blob() - return response as BLOB (binary data with type)
e. response.arrayBuffer() - return response as ArrayBuffer (low-level representation of binary data)
f. response.body - it is a ReadableStream object, it allows you read the data as a continuous stream.

`We can choose only one body-reading method. If we’ve already got the response with response.text(), then response.json() won’t work, as the body content has already been processed.`

```javascript
const text = await response.text(); // return response
const json = await response.json(); // fails (already consumed)
```

## Request Headers

To set request header in fetch, we can use `headers` option.

```javascript
const response = await fetch(url, {
  headers: {
    Authentication: 'secret'
  }
});
```

## POST request

To make a post request, fetch should have following options:

1. method: `POST`
2. body:
   a. string (eg., JSON encoded)
   b. FormData object
   c. Blob

```javascript
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(body)
});
const result = await response.json();
```

## FormData

FormData objects are used to capture HTML form and submit it using fetch or another network method.
We can either create new FormData(form) from an HTML form, or create a object without a form at all, and then append fields with methods:

1. formData.append(name, value)
2. formData.append(name, blob, filename)
3. formData.set(name, value)
4. formData.set(name, blob, filename)

`a. The set method removes fields with the same name, append doesn’t. That’s the only difference between them. b. To send a file, 3-argument syntax is needed, the last argument is a file name, that normally is taken from user filesystem for <input type="file">.`

5. formData.delete(name)
6. formData.get(name)
7. formData.has(name)

## Fetch: Download Progress

We can use response.body to a get a readable stream. For eg.,

```javascript
const reader = await response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(`Received ${value.length} bytes`);
}
```

1. done - `true` when reading is complete, otherwise `false`.
2. value - a typed array of bytes: `Uint8Array`

```javascript
const downloadProgress = async () => {
  const response = await fetch(
    'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits?per_page=100'
  );
  const totalResponseLength = response.headers.get('Content-Length') ?? 0;
  const reader = await response.body.getReader();
  const chunks = [];
  let receivedResponseLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedResponseLength += value.length;
    console.log(`received ${receivedResponseLength} of ${totalResponseLength}`);
  }
  const chunksAll = new Uint8Array(receivedResponseLength);
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }
  const result = new TextDecoder('utf-8').decode(chunksAll);
  return JSON.parse(result);
};

downloadProgress().then(console.log).catch(console.error);
```

## Fetch: Abort

There’s a special built-in object for aborting an asynchronous task: AbortController. It can be used to abort not only fetch, but other asynchronous tasks as well.

```javascript
const controller = new AbortController();
const signal = controller.signal;

signal.addEventListener('abort', () => console.log('aborted'));

// aborts
controller.abort();

console.log(signal.aborted);
```

Using with fetch:

```javascript
const abortControllerWithFetch = async () => {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, 100);
  const response = await fetch(
    'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits?per_page=100',
    {
      signal: controller.signal
    }
  );
  return response.json();
};
abortControllerWithFetch()
  .then(console.log)
  .catch((err) => console.error(err.name));
```

`AbortController is scalable, it allows to cancel multiple fetches at once`

## Fetch: CORS

CORS stands for cross origin resource sharing.
Cross origin requests - those sent to another domain (even a subdomain) or protocol or port – require special headers from the remote side.

`We can perform cross origin request using a script tag. A script could have any src, with any domain, like <script src="http://another.com/…">. It’s possible to execute a script from any website. If a website, e.g. another.com intended to expose data for this kind of access, then a so-called “JSONP (JSON with padding)” protocol was used.`

```javascript
function gotWeather({ temperature, humidity }) {
  console.log(`temperature: ${temperature}, humidity: ${humidity}`);
}
const script = document.createElement('script');
script.src = 'http://another.com/weather.json?callback=gotWeather';
document.body.appendChild(script);
```

There are two types of cross origin requests:

1. simple request
2. all other request

### Simple Request

A request is simple if it fulfills following conditions:

1. simple methods are used. `GET`, `POST`, `HEAD`.
2. simple headers are used.
   a. Accept
   b. Accept-Language
   c. Content-Language
   d. Content-Type = `application/x-www-form-urlencoded`, `multipart/form-data` or `text/plain`

Any other request is non-simple.

`When we try to make a non-simple request, the browser sends another "preflight" request that asks the server - does it agree to accept such cross origin request, or not? And unless server explicitly confirms that with headers, a non simple request is not sent`

When we perform a simple cross origin request, browser attaches `Origin` in the header. If server responds with
`Access-Controll-Allow-Origin=Origin or *`, then the response is successfull, otherwise an error.

For cross origin simple requests, by default following response headers can be accessed:

1. Cache-Control
2. Content-Length
3. Content-Type
4. Expires
5. Last-Modified
6. Pragma

To grant JavaScript access to any other response header, the server must send Access-Control-Expose-Headers header. It contains a comma-separated list of non-simple header names that should be made accessible.

```javascript
200 OK
Content-Type:text/html; charset=UTF-8
Content-Length: 12345
API-Key: 2c9de507f2c54aa1
Access-Control-Allow-Origin: https://my-origin.com
Access-Control-Expose-Headers: Content-Length,API-Key
```

### Non simple request

In case on non simple request, an additional "preflight" request is sent with `OPTIONS` method and two headers.

1. Access-Control-Request-Method
2. Access-Control-Request-Headers

If the server agrees to serve the requests, then it should respond with empty body, status 200 and headers.

1. Access-Control-Allow-Origin, either = \* or current origin
2. Access-Control-Allow-Method
3. Access-Control-Allow-Headers

## URL object

```javascript
const urlObject = new URL(url, [base]);
```

1. url – the full URL or only path (if base is set, see below),
2. base – an optional base URL: if set and url argument has only path, then the URL is generated relative to base.

It gives following options, for `url = new URL('https://api.github.com/sarangkartikey50/repos/drawing-board/commits?per_page=100#test')`:

1. url.href: = url.toString() will give full url
2. url.protocol = https
3. url.origin = https://api.github.com:8080 (if port is present)
4. url.hostname = api.github.com
5. url.port = 8080 (if port is present)
6. url.pathname = /sarangkartikey50/respos/drawing-board/commits
7. url.search = ?per_page=100
8. url.hash = #test

### URLSearchParams

```javascript
const url = new URL('https://google.com/search?query=JavaScript');
```

we can use `url.searchParams.<methods>` to update search params.

1. append(name, value) - url.append('page', '10')
2. delete(name) - url.delete('page')
3. get(name) - url.get('page') // returns 10
4. getAll(name) - url.getAll('page') // returns array values [10]
5. has(name) - url.has('page') // returns true or false
6. set(name, value) - url.set('page', 11) // sets/repaces a value
7. sort() - url.sort() // sorts parameters by name

### Encoding and Decoding

```javascript
const url = new URL('https://google.com/search?query=JavaScript rocks');
```

We can encode & decode strings using following methods:

1. encodeURI(url) - encodes url as a whole.

```javascript
const encodedUrl = encodeURI(url); //https://google.com/search?query=JavaScript%20rocks
```

2. decodeURI(url) - decodes url as a whole.

```javascript
const decodedUrl = decodeURI(encodeURI); //https://google.com/search?query=Javascript rocks
```

3. encodeURIComponent(component) - encodes a part of url. For eg., searchParams or hash

```javascript
const encodedSearchParams = encodeURIComponent('Rock&Roll'); //Rock%26Roll
// if we use encodeURL, then result will Rock&Roll only
```

4. decodeURIComponent(component) - decodes a part of url.

```javascript
const decodedSearchParams = decodeURIComponent(encodedSearchParams); //Rock&Roll
```

## XMLHttpRequest

Fetch can't track `upload progress`.

```javascript
const xhr = new XMLHttpRequest();
xhr.open(
  'GET',
  'https://api.github.com/repos/sarangkartikey50/drawing-board/commits'
);
xhr.send();

// will be called after response is fetched
xhr.onload = function () {
  if (xhr.status !== 200) {
    console.error(`There was some error: ${xhr.statusText}`);
  } else {
    console.log(`Done, got ${xhr.response}`);
  }
};

// will update response progress
xhr.onprogress = function (event) {
  if (event.lengthComputable) {
    console.log(`Received: ${event.loaded}, Total: ${event.total}`);
  } else {
    console.log(`Received: ${event.total}`);
  }
};

// will be called on error
xhr.onerror = function () {
  console.error('request failed');
};
```

It provides following methods:

1. xhr.upload.onloadstart - called when upload has started.
2. xhr.upload.onprogress - called while upload is in progress
3. xhr.upload.onabort - called when upload is aborted.
4. xhr.upload.onload - called when upload completed successfully.
5. xhr.upload.onerror - called when upload throws error.
6. xhr.upload.timeout - sets timeout property.
7. xhr.upload.onloadend - called when upload is either completed successfully or throws error.

## Resumable file upload ([link](https://javascript.info/resume-upload))

TODO

## Long polling ([link](https://javascript.info/long-polling))

Long polling is the simplest way of persistent connection with server without using any specific protocols like
Web Sockets or Server Side Events.

### Regular polling

Here, we send request periodically, eg., after every 10 seconds.

Cons:

1. Messages are passed with delay of 10 seconds.
2. Even if there are no messages, server still gets request from clients.

### Long polling

Flow:

1. A request is sent to the server.
2. The server doesn't close a connection until it has a message to send.
3. When a message appears, the server responds to the request with it.
4. Once the browser recieves the message, it immediately sends another request.

`If the connection is close or lost, browser immediately sends another request`

Client:

```javascript
const subscribe = async () => {
  const response = await fetch('/subscribe');
  if (response.status === 502) {
    //connection timeout
    await subscribe();
  } else if (response.status !== 200) {
    console.error(`Error: ${response.statusText}`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // resumes after 1 second
    await subscribe();
  } else {
    // success
    const message = await response.text();
    console.log(`Message: ${message}`);
    await subscribe();
  }
};

subscribe().catch(console.error);
```

Server:

```javascript
const subscribers = new Map();
const onSubscribe = (req, res) => {
  let id = Math.random();
  while(subscribers.has(id)) {
    id = Math.random();
  }
  subscribers.set(id, res);
  req.on('close', () => subscribers.delete(id));
}
const onPublish = (req, res) => {
  const message = res.body();
  subscribers.forEach(subscribedRes => {
    subscribedRes.end(message);
  });
  subscribers.clear();
}
const app = {}; // express app
app.get('/subscribe', onSubscribe);
app.post('/publish', onPublish);
```

`The server architecture must be able to work with many pending requests. If run a process per connection, then will consume
a lot of memory.

`Long polling works in situations where messages are rare. Otherwise we can use WebSockets or Server Side Events.`

## WebSocket ([link](https://javascript.info/websocket))

The WebSocket protocol provides a persistent connection between client and server. The data can be passed as `packets`
without breaking the connection along with some http headers.

WebSocket is really great for systems which requires persistent connection like online games, trading systems, chat apps.

`To open a web socket connection, we need to create a "new WebSocket" instance with a special "ws:" protocol in the url.`

```javascript
const socket = new WebSocket('ws://localhost:3000');
```

`we can also use wss for encryption like https.`

Events available:

1. open - connection established.
2. message - data received.
3. close - connection gets closed.
4. error - websocket error.

We can send the data using socket send `socket.send(data)`.

### Opening a websocket

When new WebSocket(url) is called, the browser starts connecting immediately.

1. During the connection, the browser sends a GET request to the server confirm websocket support using headers.
2. If server sends ok, then websocket connecton is established.
3. [check process here](https://javascript.info/websocket#opening-a-websocket)

For eg., 

```javascript
const socket = new WebSocket('ws://localhost:3000/chat');
```

Following headers are sent:

```javascript
GET /chat
Host: javascript.info
Origin: https://javascript.info
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
```
1. Connection: Upgrade - Signals that the client would like to change protocol.
2. Upgrade - Signals that the client would like to use websocket protocol.
3. Sec-WebSocket-Key: random key generated by the browser for security purposes.
4. Sec-WebSocket-Version: Websocket version supported by client.

`If the server agrees to the upgrade protocol, it should send 101 response.`

```javascript
101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=
```

### Data transfer using WebSockets

WebSocket communication consists of `frames` - data fragments, which can be sent from either side.

1. Text Frame - contains text
2. Binary Frame - contains binary data
3. Ping/Pong Frame - Used to check connection, sent from server. Browsers automatically responds to these, etc.

`socket.send() allows data to be sent as string or binary inluding Blob, ArrayBuffers`.

`When we receive data, it always comes string. We can choose binary using socket.binaryType. We can either set it 
to 'blob' or 'arraybuffer'. Default is 'blob'.`

```javascript
socket.binaryType = 'arraybuffer';
socket.onmessage = function(event) {
  // data will come either as string or arraybuffer
}
```

### Rate limiting

It is possible that the user might be on a slow internet connection. In case data to be sent is buffered.
We can check every 100ms whether is buffered amount is 0 or not and then send the data using `socket.send()`.

```javascript
setInterval(function() {
  if(socket.bufferedAmount === 0) socket.send(data);
}, 100);
```

### Connection close

When a party (client or server) wants to close a connection, they send connection close frame using `socket.close([code], [reason])`

```javascript
// server
socket.close(1000, 'Done');

// client
socket.onclose = function(event) {
  // event.code = 1000
  // event.reason = 'Done'
  // event.wasClean = true (clean close)
}
```

### Connection state

We can check the websocket connection state using `socket.readyState`.

1. 0 - 'Connecting' the connection hasn't been established yet.
2. 1 - 'OPEN' communicating.
3. 2 - 'CLOSING' connection is closing.
4. 3 - 'CLOSED' connection is closed.


## Server sent events

Server sent events uses built in class EventSource, that keeps connection with the server and allow to receive events from it.
It is similar to WebSocket protocol.

## Difference between WebSocket and Server sent events

1. WebSocket is bidirectional, Server sent events can be sent from server only.
2. WebSocket uses websocket protocol, Server sent events use http.
3. WebSocket can exchange binary or text data, Server sent events can exchange only text data.

`EventSource is a less powerful way of communicating with the server than websocket.`

`EventSource supports auto reconnection.`


```javascript
const eventSource = new EventSource('http://localhost:3000/events');
eventSource.onmessage = function(event) {
  console.log(event.data);
}
```

## Reconnection

Reconnection happens automatically in case on server sent events after couple of seconds. 
Although server may send `retry: 1500` alongwith data or standalone.

1. If the server wants to stop the browser from reconnecting, it should send response with status code 204.
2. If the browser wants to close the connection, it should call `eventSource.close()`.

`If the connection is closed, there's no way to reconnecting it. We need to create new EventSource object.`

## Message id

When the connection is broken, either side don't know which messages were received.
We should always send id along with data.

`When id is sent, it is set as eventSource.lastEventId.`
`Upon reconnection, a header is sent Last-Event-ID with that id so that the server can resend the lost messages again.`

`id is appended below data by the server so that it can set into eventSource.lastEventId.`

## Event types

By default event source generates three events:

1. message - a message is received as event.data
2. open - the connection is open.
3. error - the connection could not be established.

## Custom events

```javascript
const eventSource = new EventSource('http:localhost:3000/events');
eventSource.addEventListener('join', event => {
  console.log(`Joined: ${event.data}`);
});
eventSource.addEventListener('message', event => {
  console.log(`Message: ${event.data}`);
});
eventSource.addEventListener('leave', event => {
  console.log(`Left: ${event.data}`);
});
```
