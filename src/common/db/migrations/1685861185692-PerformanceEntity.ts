import { MigrationInterface, QueryRunner } from "typeorm";

export class PerformanceEntity1685861185692 implements MigrationInterface {
    name = 'PerformanceEntity1685861185692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`performances\` (\`id\` int NOT NULL AUTO_INCREMENT, \`terminalID\` varchar(255) NOT NULL, \`date\` datetime NOT NULL, \`inService\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
  }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`performances\``);
    }

}
