import type { MigrationInterface, QueryRunner } from "typeorm";

export class TypeormOverride1715762548551 implements MigrationInterface {
	name = "TypeormOverride1715762548551";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
		await queryRunner.query(`DROP TABLE IF EXISTS embed_item;`);
		await queryRunner.query(
			`CREATE TABLE embed_item (id bigserial PRIMARY KEY, embedding vector(1536) NOT NULL)`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS embed_item;`);
		await queryRunner.query(
			`CREATE TABLE embed_item (id bigserial PRIMARY KEY, embedding text NOT NULL)`
		);
	}
}
