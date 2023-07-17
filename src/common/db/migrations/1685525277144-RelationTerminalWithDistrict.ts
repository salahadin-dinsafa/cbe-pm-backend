import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationTerminalWithDistrict1685525277144 implements MigrationInterface {
    name = 'RelationTerminalWithDistrict1685525277144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`terminals\` ADD \`districtId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`terminals\` ADD CONSTRAINT \`FK_9269642c86cfe145ee74317534f\` FOREIGN KEY (\`districtId\`) REFERENCES \`districts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`terminals\` DROP FOREIGN KEY \`FK_9269642c86cfe145ee74317534f\``);
        await queryRunner.query(`ALTER TABLE \`terminals\` DROP COLUMN \`districtId\``);
    }

}
