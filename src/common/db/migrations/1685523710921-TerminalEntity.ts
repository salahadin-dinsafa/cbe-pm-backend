import { MigrationInterface, QueryRunner } from "typeorm";

export class TerminalEntity1685523710921 implements MigrationInterface {
    name = 'TerminalEntity1685523710921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`terminals\` (\`id\` int NOT NULL AUTO_INCREMENT, \`terminalID\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_adee87af25c5c6071705d627ab\` (\`terminalID\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_adee87af25c5c6071705d627ab\` ON \`terminals\``);
        await queryRunner.query(`DROP TABLE \`terminals\``);
    }

}
