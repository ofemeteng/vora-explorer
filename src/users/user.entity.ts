import { Column, Entity, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Passkey } from './passkey.entity.js';

@Entity()
@Index(['username'], { unique: true })
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: true })
    address: string | null;

    @Column({ type: 'jsonb', nullable: true })
    currentOptions: any;

    @OneToMany(() => Passkey, passkey => passkey.user)
    passkeys: Passkey[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

}


