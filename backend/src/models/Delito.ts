import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delitos')
export default class Delito {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    tipo_delito: string;

    @Column()
    data: string;

    @Column()
    hora: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    descricao: string;
}