import * as uuid from 'uuid/v4';
import { UpdateOptions, FindOptions, DatabaseError } from 'sequelize';
import { executeQuery } from '../helpers/execute-query';
import { SequelizeMock } from './sequelize.mock';

export interface BasicModel {
    id: string;
}

const asyncNoop = () => Promise.resolve();

export function addMethods<T>(entry: T): T {
    const copy = { ...entry };
    (copy as any).save = asyncNoop;
    (copy as any).toJSON = () => {
        delete (copy as any).save;
        delete (copy as any).toJSON;
        return copy;
    };
    return copy;
}

export class MockedModel<T extends BasicModel> {
    private data: Array<T>;
    sequelize = new SequelizeMock();

    constructor(
        data: Array<T>
    ) {
        this.data = data.map(addMethods);
    }

    findAll(options?: FindOptions): Promise<Array<T>> {
        if (!options) {
            return Promise.resolve(this.data);
        }
        const result = executeQuery(options, this.data);
        return Promise.resolve(result);
    }

    findOne(options: FindOptions): Promise<T> {
        const [result] = executeQuery({
            ...options,
            limit: 1
        }, this.data);
        return Promise.resolve(result);
    }

    findByPk(primaryKey: string): Promise<T | undefined> {
        return Promise.resolve(this.data.find(entry => entry.id === primaryKey));
    }

    create(instance: Partial<T>): Promise<T> {
        const dataInstance = addMethods({
            id: uuid(),
            ...instance
        });
        this.data.push(dataInstance as T);
        return Promise.resolve(dataInstance as T);
    }

    update(updated: Partial<T>, options: UpdateOptions): Promise<[number]> {
        const [result] = executeQuery(options, this.data);
        if (!result) {
            throw new DatabaseError(new Error(`Could not find entity with given options: ${options}`));
        }
        for (const prop of Object.keys(updated) as Array<keyof T>) {
            (result as any)[prop] = updated[prop];
        }
        return Promise.resolve([1]);
    }

    destroy(options: FindOptions): Promise<void> {
        const [result] = executeQuery(options, this.data);
        this.data.splice(this.data.findIndex(el => el.id === result.id), 1);
        return Promise.resolve();
    }
}
