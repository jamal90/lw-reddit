import { Migration } from '@mikro-orm/migrations';

export class Migration20240803232226 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "post" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "post" alter column "updated_at" type date using ("updated_at"::date);');
  }

}
