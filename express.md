# Express

1. Express is the most popular node framework for creating servers.
2. Express is unopiniated framework. We can use it in different ways.

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(3000, () => console.log('running @ http://localhost:3000/'));
```

## Routes and Controllers

1. Routes are part of express code that associates with an http method and forwards a request to its appropriate controller.
2. Routes can be created using express.Router middleware.

```javascript
// users.js - Route for users

const express = require('express');
const router = express.Router();

router.get('/', IndexRouter);
router.get(':id', UserRouter);

module.exports = router;

// We can use the router module using app.use()
// Somewhere in the directory

const app = express();
const users = require('./routes/users.js');

app.use('/users', users);
```

### Route paths

1. The route paths define the endpoints at which the request can be made.
2. Route paths can also be string patterns.
3. We can use `?` - optional with one character, `+` - must with n characters, `*` - optional with n characters, `()` - can be used to create groups.

```javascript
// catfish, blowfish, ... *fish
app.get('/.*fist$/', FishRoute);
```

### Route Parameters

1. Route parameters helps in capturing variables in the url at specific positions.

```javascript
app.get('/users/:id/profile', (req, res) => {
  // req.params.id - :id
});
```