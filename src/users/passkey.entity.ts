import { Column, Entity, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity.js';

import type {
    AuthenticatorTransportFuture,
    CredentialDeviceType,
    Base64URLString,
} from '@simplewebauthn/types';

@Entity()
@Index(['id'], { unique: true })
@Index(['username', 'webauthnUserID'], { unique: true })
export class Passkey {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'text' })
    id: Base64URLString;

    @Column({ type: 'bytea' })
    publicKey: Uint8Array;

    @ManyToOne(() => User, user => user.passkeys)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @Column()
    username: string;

    @Column({ type: 'text' })
    webauthnUserID: Base64URLString;

    @Column({ type: 'bigint' })
    counter: number;

    @Column({ type: 'varchar', length: 32 })
    deviceType: CredentialDeviceType;

    @Column({ type: 'boolean' })
    backedUp: boolean;

    @Column('simple-array', { nullable: true })
    transports?: AuthenticatorTransportFuture[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}