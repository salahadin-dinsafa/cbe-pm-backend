import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationDistrictWithStaffs1685516767249 implements MigrationInterface {
    name = 'RelationDistrictWithStaffs1685516767249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_eb6238871939dcb0722a979524\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`districtId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_dd0b12a0e1003e7968b756f371e\` FOREIGN KEY (\`districtId\`) REFERENCES \`districts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_dd0b12a0e1003e7968b756f371e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`districtId\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_eb6238871939dcb0722a979524\` ON \`users\` (\`managerDistrictId\`)`);
    }

}
