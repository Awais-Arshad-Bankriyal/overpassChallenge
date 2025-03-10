import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CacheEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column('text')
  value: string;

  @Column()
  expiresAt: Date;
}