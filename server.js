const path = require("path");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./src/db');
const auth = require('./src/auth');
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

require('dotenv').config();

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));
// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});


fastify.post('/login', async (req, res) => {
  const { username, userpass } = req.body;
  
  try {
    console.log("login");
    db.getAllUsers().then(users => console.log(users.length));
    const user = await db.getUserByUsername(username);
    
    console.log(user);
  
    if (!user) {
      res.status(401).send({ error: "Usuari no trobat" });
      return;
    }
    
    const isMatch = await bcrypt.compare(userpass, user.password);
    if (isMatch) {
      const pairing = await db.getEventPairing(user.id, 1);
      const targetUser = await db.getUserById(pairing.target_id);
      user.password = '';
      targetUser.password = '';
      res.send({ success: true, user: user, targetUser: targetUser });
    } else {
      console.log("failure");
      res.status(401).send({success: false, error: "Contrasenya incorrecta" });
    }
  } catch (err) {
    console.error(err);
    res.send({ error: "Error en la base de dades" });
  }
});

fastify.get("/", { preHandler: auth.verifyJWT }, function (request, reply) {
  return reply.view("/src/pages/index.hbs");
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
