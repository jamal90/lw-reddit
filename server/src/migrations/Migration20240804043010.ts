import { Migration } from '@mikro-orm/migrations';

export class Migration20240804043010 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "title" varchar(512) not null, "content" text not null, "user_name" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);');

    this.addSql('create table "user" ("id" serial primary key, "user_name" varchar(255) not null, "email" varchar(512) not null, "password" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);');
    this.addSql('alter table "user" add constraint "user_user_name_unique" unique ("user_name");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }

}
