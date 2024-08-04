import dotenv from 'dotenv';
import {defineConfig, PostgreSqlDriver} from '@mikro-orm/postgresql';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import path from 'path';

// configure env
dotenv.config();

export default defineConfig({
    migrations: { 
        path: path.join(__dirname, './migrations')
    },
    dbName: 'reddit',
    driver: PostgreSqlDriver,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    // entities: ['dist/entities/*.js'],
    entities: [Post],
    debug: !__prod__
});