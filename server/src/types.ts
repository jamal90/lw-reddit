import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { SqlEntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { RedisClientType } from "@redis/client";
import { Request, Response } from "express";

export type AppContext = {
  em: SqlEntityManager<PostgreSqlDriver> &
    EntityManager<IDatabaseDriver<Connection>>;
  redis: RedisClientType;
  req: Request;
  res: Response;
};
