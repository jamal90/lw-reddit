import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express, { Express } from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import dbConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/HelloResolver";
import { PostResolver } from "./resolvers/PostResolver";
import { UserResolver } from "./resolvers/UserResolver";

import RedisStore from "connect-redis";
import cors from "cors";
import session from "express-session";
import { createClient } from "redis";
import { SESSION_COOKIE, __prod__ } from "./constants";

// configure env
dotenv.config();

const main = async () => {
  console.info("DB Cred: ", dbConfig);
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
      name: SESSION_COOKIE,
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

  setupCors(app);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      redis: redisClient,
      em: orm.em.fork(),
      req,
      res,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(port, () => {
    console.info(`listening on port ${port}`);
  });
};

function setupCors(app: Express) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://studio.apollographql.com",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
}

main();
