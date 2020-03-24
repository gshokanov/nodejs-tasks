import { MockedModel, BasicModel } from '../mocks/model.mock';
import { GroupMapper } from '../data-access/group.mapper';
import { GroupService } from './group.service';
import { Group } from '../types/group';

const groupMock: Array<Group> = [
    {
        id: '1',
        name: 'group1',
        permissions: ['READ', 'WRITE']
    },
    {
        id: '2',
        name: 'group1',
        permissions: ['READ', 'WRITE', 'DELETE']
    }
];

const userGroupMock = [
    {
        id: '100',
        userId: '200',
        groupId: '1'
    },
    {
        id: '101',
        userId: '201',
        groupId: '1'
    },
    {
        id: '102',
        userId: '202',
        groupId: '1'
    },
    {
        id: '103',
        userId: '203',
        groupId: '2'
    }
];

describe('GroupService', () => {
    let service: GroupService;
    let groupModelMock: MockedModel<any>;
    let userGroupModelMock: MockedModel<any>;
    let mapper: GroupMapper;

    beforeEach(() => {
        groupModelMock = new MockedModel(groupMock as Array<BasicModel>);
        userGroupModelMock = new MockedModel(userGroupMock);
        mapper = new GroupMapper();
        service = new GroupService(groupModelMock as any, mapper, userGroupModelMock as any);
    });

    describe('findAll', () => {
        it('should find all groups', async () => {
            const result = await service.findAll();
            expect(result).toEqual(groupMock);
        });
    });

    describe('findById', () => {
        it('should find group by provided id', async () => {
            const result = await service.findById(groupMock[0].id as string);
            expect(result).toEqual(groupMock[0]);
        });

        it('should return null if no entries exist for provided id', async () => {
            const result = await service.findById('thisDoesNotExist');
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create new group', async () => {
            const group: Group = {
                id: '777',
                name: 'supergroup',
                permissions: ['READ']
            };
            await service.create(group);
            const result = await service.findById('777');
            expect(result).toEqual(group);
        });

        it('should return id for created group', async () => {
            const result = await service.create({
                id: '877',
                name: 'uniquename',
                permissions: ['WRITE']
            });
            expect(typeof result).toBe('string');
        });
    });

    describe('update', () => {
        it('should update existing group', async () => {
            await service.update(groupMock[0].id as string, {
                ...groupMock[0],
                name: 'newcoolname'
            });
            const group = await service.findById(groupMock[0].id as string);
            expect(group?.name).toBe('newcoolname');
        });
    });

    describe('delete', () => {
        it('should delete existing group', async () => {
            await service.delete(groupMock[0].id as string);
            const result = await service.findById(groupMock[0].id as string);
            expect(result).toBeNull();
        });
    });

    describe('addUsersToGroup', () => {
        it('should create entries via user group model', async () => {
            await service.addUsersToGroup('1', ['48']);
            const result = await userGroupModelMock.findOne({
                where: {
                    userId: '48'
                }
            });
            expect(result).toBeTruthy();
        });
    });
});
