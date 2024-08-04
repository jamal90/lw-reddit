import { Migration } from '@mikro-orm/migrations';

export class Migration20240803231358 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "content" text not null, "user_name" varchar(255) not null, "created_at" date not null, "updated_at" date not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');
  }

}
