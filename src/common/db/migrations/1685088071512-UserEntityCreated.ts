import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntityCreated1685088071512 implements MigrationInterface {
    name = 'UserEntityCreated1685088071512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NULL DEFAULT '', \`password\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'DISTRICT_IS_MG', 'IS', 'OPERATOR') NOT NULL DEFAULT 'OPERATOR', \`photo\` varchar(255) NULL DEFAULT '', UNIQUE INDEX \`IDX_1e3d0240b49c40521aaeb95329\` (\`phoneNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_1e3d0240b49c40521aaeb95329\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
