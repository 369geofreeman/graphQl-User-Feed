const { ApolloServer, gql } = require("apollo-server");

// The GraphQL schema
const typeDefs = gql`
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    title: () => "In Utero",
    price: () => 9.99,
    releaseYear: () => 1993,
    rating: () => null,
    inStock: () => true,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
