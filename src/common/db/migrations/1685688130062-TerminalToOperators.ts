import { MigrationInterface, QueryRunner } from "typeorm";

export class TerminalToOperators1685688130062 implements MigrationInterface {
    name = 'TerminalToOperators1685688130062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`operatorsTerminal\` (\`terminalsId\` int NOT NULL, \`usersId\` int NOT NULL, INDEX \`IDX_3cef2061f28817b39441c03bdc\` (\`terminalsId\`), INDEX \`IDX_b9846eb1a02bc2be71611a8c13\` (\`usersId\`), PRIMARY KEY (\`terminalsId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`operatorsTerminal\` ADD CONSTRAINT \`FK_3cef2061f28817b39441c03bdc2\` FOREIGN KEY (\`terminalsId\`) REFERENCES \`terminals\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`operatorsTerminal\` ADD CONSTRAINT \`FK_b9846eb1a02bc2be71611a8c139\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`operatorsTerminal\` DROP FOREIGN KEY \`FK_b9846eb1a02bc2be71611a8c139\``);
        await queryRunner.query(`ALTER TABLE \`operatorsTerminal\` DROP FOREIGN KEY \`FK_3cef2061f28817b39441c03bdc2\``);
        await queryRunner.query(`DROP INDEX \`IDX_b9846eb1a02bc2be71611a8c13\` ON \`operatorsTerminal\``);
        await queryRunner.query(`DROP INDEX \`IDX_3cef2061f28817b39441c03bdc\` ON \`operatorsTerminal\``);
        await queryRunner.query(`DROP TABLE \`operatorsTerminal\``);
    }

}
