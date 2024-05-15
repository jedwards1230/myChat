import type { MigrationInterface, QueryRunner } from "typeorm";

export class TypeormOverride1715762548551 implements MigrationInterface {
	name = "TypeormOverride1715762548551";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
		await queryRunner.query(
			`ALTER TABLE embed_item ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector(1536);`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE embed_item ALTER COLUMN embedding TYPE text USING embedding::text;`
		);
	}
}
