import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserEntity1684406672488 implements MigrationInterface {
    name = 'AddAdmin1684406672488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO \`users\` (\`firstname\`, \`lastname\`,\`password\`, \`phoneNumber\`,\`role\`) 
            VALUES('Salahadin','Dinsafa','$2a$15$d.E3oOmDqEIXThc2T8w2/elWwzno.yXgxs9VfZ6yPNfxeto243F/i','+251933303700','ADMIN');
            INSERT INTO \`districts\` (\`name\`) 
            VALUES('DIRE DAWA');
            INSERT INTO \`districts\` (\`name\`) 
            VALUES('JIJIGA');
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users WHERE phoneNumber=+251933303700`);
    }

}
