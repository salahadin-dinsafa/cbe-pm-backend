import { MigrationInterface, QueryRunner } from "typeorm";

export class TerminalEntityName1685605253485 implements MigrationInterface {
    name = 'TerminalEntityName1685605253485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`terminals\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`terminals\` DROP COLUMN \`name\``);
    }

}
