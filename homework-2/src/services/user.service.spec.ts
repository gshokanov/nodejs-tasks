import { UserService } from './user.service';
import { MockedModel } from '../mocks/model.mock';
import { UserMapper } from '../data-access/user.mapper';
import { DatabaseUser } from '../types/user';
import { UserModel } from '../models/user.model';

const mockUsers: Array<DatabaseUser> = [
    {
        id: '123',
        login: 'Robert',
        password: 'password',
        age: 12,
        isDeleted: false
    },
    {
        id: '456',
        login: 'Rob',
        password: 'password2',
        age: 17,
        isDeleted: false
    },
    {
        id: '789',
        login: 'Abram',
        password: 'password3',
        age: 42,
        isDeleted: true
    },
    {
        id: '987',
        login: 'Roth',
        password: 'supersecure',
        age: 87,
        isDeleted: true
    }
];

describe('UserService', () => {
    let service: UserService;
    let mockedModel: MockedModel<any>;
    let mapper: UserMapper;

    beforeEach(() => {
        mockedModel = new MockedModel(mockUsers);
        mapper = new UserMapper();
        service = new UserService(mockedModel as any, mapper);
    });

    describe('autoSuggestUsers', () => {
        it('should return suggested users', async () => {
            const result = await service.autosuggestUsers('Ro', 10);
            expect(result).toEqual(mockUsers.slice(0, 2).map(user => {
                const copy = { ...user };
                (copy as any).toJSON = () => ({ ...user });
                return mapper.toDomain(copy as UserModel);
            }));
        });

        it('should apply limit correctly', async () => {
            const result = await service.autosuggestUsers('Ro', 1);
            expect(result.length).toBe(1);
        });

        it('should skip soft deleted users', async () => {
            const result = await service.autosuggestUsers('Ro', 10);
            expect(result.find(user => user.id === '987')).toBeFalsy();
        });
    });

    describe('findById', () => {
        it('should return user if present', async () => {
            const user = await service.findById(mockUsers[0].id);
            const result = { ...mockUsers[0] };
            delete result.isDeleted;
            expect(user).toEqual(result);
        });

        it('should strip database only data on returned user', async () => {
            const user = await service.findById(mockUsers[0].id);
            expect(user).not.toHaveProperty('isDeleted');
        });

        it('should return null if user is marked as deleted', async () => {
            const user = await service.findById(mockUsers[2].id);
            expect(user).toBe(null);
        });
    });

    describe('create', () => {
        it('should return id of created user', async () => {
            const id = await service.create({
                login: 'John',
                password: 'abcd',
                age: 42
            });
            expect(typeof id).toBe('string');
        });
    });

    describe('update', () => {
        it('should return false if user does not exist', async () => {
            const result = await service.update('doesNotExist', {
                login: 'foo',
                password: 'bar',
                id: 'foo',
                age: 42
            });
            expect(result).toBeFalsy();
        });

        it('should update props correctly', async () => {
            await service.update(mockUsers[0].id, {
                ...mockUsers[0],
                login: 'Abraham'
            });
            const user = await service.findById(mockUsers[0].id);
            expect(user?.login).toBe('Abraham');
        });
    });

    describe('delete', () => {
        it('should mark user as deleted and return true', async () => {
            const result = await service.delete(mockUsers[0].id);
            const user = await mockedModel.findByPk(mockUsers[0].id);
            expect(result).toBeTruthy();
            expect(user.isDeleted).toBeTruthy();
        });

        it('should return false if user does not exist', async () => {
            const result = await service.delete('random-id');
            expect(result).toBeFalsy();
        });

        it('should return false if user has already been marked as deleted', async () => {
            const result = await service.delete(mockUsers[2].id);
            expect(result).toBeFalsy();
        });
    });

    describe('login', () => {
        it('should return user on successful login', async () => {
            const result = await service.login({ login: mockUsers[0].login, password: mockUsers[0].password });
            const expected = {
                ...mockUsers[0]
            };
            delete expected.isDeleted;
            expect(result).toEqual(expected);
        });

        it('should return null on incorrect password', async () => {
            const result = await service.login({ login: mockUsers[0].login, password: 'randomIncorrectPassword' });
            expect(result).toBeNull();
        });
    });
});
