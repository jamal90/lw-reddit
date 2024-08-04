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

  const app = express();
  const port = process.env.PORT || 4000;
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em.fork() }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.info(`listening on port ${port}`);
  });
};

main();
