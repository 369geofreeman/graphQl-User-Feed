const { ApolloServer, gql } = require("apollo-server");
import { v4 as uuidv4 } from "uuid";

// DUMMY_DATA to emulate database
let users = [
  { id: "1", name: "Joshua", email: "joshua@example.com", age: 103 },
  { id: "2", name: "Jerry", email: "jerry@example.com", age: 35 },
  { id: "3", name: "Sarah", email: "sarah@example.com", age: 27 },
];
let posts = [
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

let comments = [
  { id: "1", body: "Yo, first comment!", author: "1", post: "1" },
  { id: "2", body: "This is awesome", author: "2", post: "3" },
  { id: "3", body: "What a time to be alive", author: "2", post: "3" },
  {
    id: "4",
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
  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePost): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateComment): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }
  input CreatePost {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }
  input CreateComment {
    body: String!
    author: ID!
    post: ID!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      // Check if email exists
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) throw new Error("Email taken");

      // Save user in object
      const user = {
        id: uuidv4(),
        ...args.data,
      };
      // push user into the users array (fake database)
      users.push(user);
      // Return user so we can do stuff with the data
      return user;
    },
    deleteUser(parent, args, ctx, info) {
      // Check if user exists
      const userIndex = users.findIndex((user) => user.id === args.id);
      if (userIndex === -1) throw new Error("User not found");
      // Splice user from array
      const deletedUsers = users.splice(userIndex, 1);
      // Remove all users posts(all data associated with user)
      posts = posts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }
        return !match;
      });
      // remove all users comments
      comments = comments.filter((comment) => comment.author !== args.id);
      // Return deleted user
      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      if (!userExists) throw new Error("User not found");

      const post = {
        id: uuidv4(),
        ...args.data,
      };
      posts.push(post);
      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);
      if (postIndex === -1) throw new Error("Post not found");
      const deletedPosts = posts.splice(postIndex, 1);
      comments = comments.filter((comment) => comment.post !== args.id);
      return deletedPosts[0];
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some(
        (post) => post.id === args.data.post && post.published
      );
      if (!userExists || !postExists) throw new Error("User or post not found");
      const comment = {
        id: uuidv4(),
        ...args.data,
      };
      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );
      if (commentIndex === -1) throw new Error("No comment found");
      const deletedComments = comments.splice(commentIndex, 1);
      return deletedComments[0];
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
