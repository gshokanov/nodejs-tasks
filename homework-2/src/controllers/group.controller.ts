import { Router } from 'express';
import { ValidationError } from 'sequelize';
import { GroupService } from '../services/group.service';
import { GroupModel } from '../models/group.model';
import { UserGroupModel } from '../models/user-group.model';
import { GroupMapper } from '../data-access/group.mapper';
import { groupValidator } from '../middleware/validators';
import { logController } from '../middleware/log-controller';
import { controllerErrorHandler } from '../middleware/error-handler';

const router = Router();
const service = new GroupService(GroupModel, new GroupMapper(), UserGroupModel);

router.use(logController('GroupController'));

router.get('/', async (req, res, next) => {
    try {
        const groups = await service.findAll();
        res.json(groups);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const group = await service.findById(id);
        if (!group) {
            return res.sendStatus(404);
        }
        res.json(group);
    } catch (err) {
        next(err);
    }
});

router.post('/', groupValidator, async (req, res, next) => {
    try {
        const group = req.body;
        const id = await service.create(group);
        res.status(201).send(id);
    } catch(err) {
        next(err);
    }
});

router.post('/:id/addUsersToGroup', async (req, res, next) => {
    try {
        const { userIds } = req.body;
        const { id: groupId } = req.params;
        await service.addUsersToGroup(groupId, userIds);
        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
});

router.put('/:id', groupValidator, async (req, res, next) => {
    try {
        const updatedGroup = req.body;
        const { id } = req.params;
        await service.update(parseInt(id), updatedGroup);
        res.sendStatus(200);
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.sendStatus(404);
        }
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.sendStatus(200);
    } catch(err) {
        if (err instanceof ValidationError) {
            return res.sendStatus(404);
        }
        next(err);
    }
});

router.use(controllerErrorHandler('GroupController'));

export { router as groupController };
