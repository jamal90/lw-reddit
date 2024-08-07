import "reflect-metadata";
import dotenv from "dotenv";
import { MikroORM } from "@mikro-orm/core";
import dbConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/HelloResolver";
import { PostResolver } from "./resolvers/PostResolver";
import { UserResolver } from "./resolvers/UserResolver";

import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { __prod__ } from "./constants";

// configure env
dotenv.config();

const main = async () => {
  // config orm & run migrations
  const orm = await MikroORM.init({
    ...dbConfig,
  });

  if (await orm.migrator.checkMigrationNeeded()) {
    await orm.migrator.up();
  }

  // Initialize redis client.
  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  // Initialize store.
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
    disableTouch: true, // avoid udpating redis
  });

  const app = express();
  const port = process.env.PORT || 4000;

  // Initialize session storage.
  app.use(
    session({
      name: "qid",
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: process.env.SESSION_KEY || "",
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        secure: __prod__,
        sameSite: "lax", // TODO: read about this further
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em.fork(), req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.info(`listening on port ${port}`);
  });
};

main();
