import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class cadastroDelitos1620014021936 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //Realiza alterações no DB
        await queryRunner.createTable(new Table({
            name: 'delitos',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'tipo_delito',
                    type: 'varchar',
                },
                {
                    name: 'data',
                    type: 'text',
                },
                {
                    name: 'hora',
                    type: 'text',
                },
                {
                    name: 'latitude',
                    type: 'decimal',
                    scale: 10,
                    precision: 2,

                },
                {
                    name: 'longitude',
                    type: 'decimal',
                    scale: 10,
                    precision: 2,
                },
                {
                    name: 'descricao',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                }
            ],
            
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('delitos');
    }

}
