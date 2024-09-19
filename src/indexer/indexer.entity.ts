import { Column, Entity, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Block {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ nullable: false })
    blockNumber: number;

    @Column({ nullable: true })
    txCount: number;

    @Column({ nullable: false })
    blockHash: string;

    @OneToMany(() => Transaction, transaction => transaction.block)
    transactions: Transaction[];

    @Column({ type: 'timestamp' })
    timestamp: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdIndexAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedIndexAt: Date;

}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ nullable: false })
    blockNumber: number;

    @Column({ nullable: false })
    txHash: string;

    @Column({ nullable: false })
    status: string;

    @ManyToOne(() => Block, block => block.transactions)
    @JoinColumn({ name: 'blockHash', referencedColumnName: 'blockHash' })
    block: Block;

    @Column()
    blockHash: string;

    @Column({ type: 'timestamp' })
    timestamp: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdIndexAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedIndexAt: Date;

}

@Entity()
export class Contract {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ nullable: false })
    blockNumber: number;

    // TODO: set a relationship to transaction through the transaction hash
    @Column({ nullable: false })
    txHash: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    deployer: string;

    @Column({ type: 'timestamp' })
    timestamp: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdIndexAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedIndexAt: Date;

}