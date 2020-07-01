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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
