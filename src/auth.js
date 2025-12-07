const jwt = require('jsonwebtoken');

// Middleware per a verificar el token JWT
const verifyJWT = (request, reply, done) => {
  const token = request.headers['authorization']?.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ error: 'Token no proporcionat.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return reply.status(401).send({ error: 'Token no vàlid.' });
    }

    // Token vàlid
    request.user = decoded; // Opcional: Afegeix les dades de l'usuari a la petició
    done();
  });
};
