import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1692367818643 implements MigrationInterface {
    name = 'Test1692367818643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "s3ImageKey" character varying NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
