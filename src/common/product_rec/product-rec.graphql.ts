import jwt from 'jsonwebtoken';
import { ProductRec, ProductRecFitSize } from './product-rec.model';

/**
 * Export a string which contains our GraphQL type definitions.
 */
export const productRecTypeDefs = `

  type ProductRec {
    _id: ID!
    profileId: String!
    category: String!
    styleId: String!
    rankId: String!
    fitSize: ProductRecFitSize!
  }

  type ProductRecFitSize {
    size: String!
  }

  input ProductRecFilterInput {
    profileId: String
  }

  input ProductRecOptionsInput {
    limit: Int
  }

  input ProductRecFitSizeInput {
    size: String
  }

  # Extending the root Query type.
  extend type Query {
    recommendations(filter: ProductRecFilterInput, options: ProductRecOptionsInput): [ProductRec]
    recommendation(profileId: String!): ProductRec
  }

  input RecInput {
    profileId: String
    category: String
    styleId: String
    rankId: String
    fitSize: ProductRecFitSizeInput
  }

  # Extending the root Mutation type.
  extend type Mutation {
    addRecommendation(input: RecInput!): ProductRec
  }

`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const productRecResolvers: any = {
  Query: {
    async recommendations(_, { filter = {}, options = {} }) {
      console.log(filter);
      const recs: any[] = await ProductRec.find(filter, null, options);
      return recs.map(rec => rec.toGraph());
    },
    async recommendation(_, { profileId }) {
      const rec: any = await ProductRec.findById(profileId);
      return rec.toGraph();
    },
  },
  Mutation: {
    async addRecommendation(_, { input }) {
      const rec: any = await ProductRec.create(input);
      return rec.toGraph();
    },
  },
};
