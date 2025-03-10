import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Landmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  type: string;
}