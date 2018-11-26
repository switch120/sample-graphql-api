export const rootTypeDefs = `
  directive @isAuthenticated on FIELD | FIELD_DEFINITION
  directive @hasRole(role: String) on FIELD | FIELD_DEFINITION

  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;

export const directiveResolvers = {
  isAuthenticated: (next, source, args, ctx, info) => {
    // const user = getUser()
    // if (user.authenticated) return next()
    throw new Error(`Must be logged in to view this field`);
  },
  hasRole: (next, source, args, ctx, info) => {
    // const user = getUser()
    // if (role === user.role) return next();
    throw new Error(`Must have role: ${args.role}`);
  },
  
}