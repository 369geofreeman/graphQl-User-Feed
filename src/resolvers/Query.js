const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(args.query) ||
        post.body.toLowerCase().includes(args.query)
    );
  },
  comments(parent, args, { db }, info) {
    return db.comments;
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
};

export { Query as default };
