const { ApolloServer, gql } = require("apollo-server");

// DUMMY_DATA to emulate database
const users = [
  { id: "1", name: "Joshua", email: "joshua@example.com", age: 103 },
  { id: "2", name: "Jerry", email: "jerry@example.com", age: 35 },
  { id: "3", name: "Sarah", email: "sarah@example.com", age: 27 },
];
const posts = [
  {
    id: "1",
    title: "Secret first blog post... shhhhh",
    body: "blablabla",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Blog post the first",
    body: "WAwawawawa",
    published: false,
    author: "1",
  },
  {
    id: "3",
    title: "The second coming",
    body: "WOOOOHOOOOOO!!!!!!!",
    published: true,
    author: "3",
  },
];

const comments = [
  { id: 1, body: "Yo, first comment!", author: "1", post: "1" },
  { id: 2, body: "This is awesome", author: "2", post: "3" },
  { id: 3, body: "What a time to be alive", author: "2", post: "3" },
  {
    id: 4,
    body: "yo, lets have a party up in gere lol ;)",
    author: "3",
    post: "1",
  },
];

// The GraphQL schema
const typeDefs = gql`
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    body: String!
    author: User!
    post: Post!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(args.query) ||
          post.body.toLowerCase().includes(args.query)
      );
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
    me() {
      return {
        id: "123908",
        name: "Mike",
        email: "mike@example.com",
      };
    },
    post() {
      return {
        id: "123",
        title: "How I fell in love with a gorilla",
        body:
          "It was a cool night on the congo when my eyes locked with the beast...",
        published: false,
      };
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, tx, info) {
      return posts.find((post) => post.id === parent.post);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
