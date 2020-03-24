import { TransactionOptions, Transaction } from 'sequelize';

class TransactionMock {
    commit(): Promise<void> {
        return Promise.resolve();
    }

    rollback(): Promise<void> {
        return Promise.resolve();
    }
}

export class SequelizeMock {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transaction(options?: TransactionOptions): Promise<Transaction> {
        return Promise.resolve(new TransactionMock() as Transaction);
    }
}
