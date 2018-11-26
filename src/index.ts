import * as dotenv from 'dotenv';
dotenv.config();

// import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import mongoose from 'mongoose';
import { rootTypeDefs, directiveResolvers } from './common/graphql-root';
import { productRecResolvers, productRecTypeDefs } from './common/product_rec/product-rec.graphql';

/**
 * Connect to the mongodb database using
 * the mongoose library.
 */
mongoose.connect(
  process.env.MONGO_URL || "",
  { useNewUrlParser: true }
);

/**
 * Declare the schema which the will hold our
 * GraphQL types and resolvers.
 */
const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, productRecTypeDefs],
  resolvers: merge(productRecResolvers),
  directiveResolvers: directiveResolvers
});

/**
 * Create the server which we will send our
 * GraphQL queries to.
 */
const server = new ApolloServer({
  schema,
  formatError(error) {
    console.log(error);
    return error;
  },
  // async context({ req }) {
  //   const token = req && req.headers && req.headers.authorization;
  //   if (token) {
  //     const data: any = jwt.verify(token, process.env.TOKEN_SECRET || "");
  //     const user = data.id ? await User.findById(data.id) : null;
  //     return { user };
  //   }
  // },
});

/**
 * Turn the server on by listening to a port
 * Defaults to: http://localhost:4000
 */
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
