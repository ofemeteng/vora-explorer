import { Column, Entity, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import type {
    AuthenticatorTransportFuture,
    CredentialDeviceType,
    Base64URLString,
} from '@simplewebauthn/types';

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


