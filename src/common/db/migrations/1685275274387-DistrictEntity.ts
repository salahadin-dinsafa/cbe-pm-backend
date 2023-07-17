import { MigrationInterface, QueryRunner } from "typeorm";

export class DistrictEntity1685275274387 implements MigrationInterface {
    name = 'DistrictEntity1685275274387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`districts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_6a6fd6d258022e5576afbad90b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6a6fd6d258022e5576afbad90b\` ON \`districts\``);
        await queryRunner.query(`DROP TABLE \`districts\``);
    }

}
