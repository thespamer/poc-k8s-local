import { Migration } from '@mikro-orm/migrations';

export class Migration20210802214030 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "emoji_votes" ("emoji_name" varchar(255) not null, "votes" int4 not null);',
    );
    this.addSql(
      'alter table "emoji_votes" add constraint "emoji_votes_pkey" primary key ("emoji_name");',
    );
  }
}
