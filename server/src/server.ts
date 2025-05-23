import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import { fileURLToPath } from 'url';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startApolloServer = async () => {
  await server.start();
  await db;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});
};

startApolloServer();
