import { MigrationInterface, QueryRunner } from "typeorm";

export class PerformanceNameAddition1687603041043 implements MigrationInterface {
    name = 'PerformanceNameAddition1687603041043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`performances\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`performances\` DROP COLUMN \`name\``);
    }

}
