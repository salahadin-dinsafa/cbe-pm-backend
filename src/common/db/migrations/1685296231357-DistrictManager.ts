import { MigrationInterface, QueryRunner } from "typeorm";

export class DistrictManager1685296231357 implements MigrationInterface {
    name = 'DistrictManager1685296231357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`managerDistrictId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_eb6238871939dcb0722a979524\` (\`managerDistrictId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_eb6238871939dcb0722a979524\` ON \`users\` (\`managerDistrictId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_eb6238871939dcb0722a979524b\` FOREIGN KEY (\`managerDistrictId\`) REFERENCES \`districts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_eb6238871939dcb0722a979524b\``);
        await queryRunner.query(`DROP INDEX \`REL_eb6238871939dcb0722a979524\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_eb6238871939dcb0722a979524\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`managerDistrictId\``);
    }

}
