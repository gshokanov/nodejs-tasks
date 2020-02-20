import { Router } from 'express';
import { GroupService } from '../services/group.service';
import { GroupModel } from '../models/group.model';
import { GroupMapper } from '../data-access/group.mapper';
import { groupValidator } from '../middleware/validators';

const router = Router();
const service = new GroupService(GroupModel, new GroupMapper());

router.get('/', async (req, res, next) => {
    try {
        const groups = await service.findAll();
        res.json(groups);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const group = await service.findById(parseInt(id));
        res.json(group);
    } catch (err) {

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

router.put('/:id', groupValidator, async (req, res) => {
    try {
        const updatedGroup = req.body;
        const { id } = req.params;
        await service.update(parseInt(id), updatedGroup);
        res.sendStatus(200);
    } catch (err) {

    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await service.delete(parseInt(id));
        res.sendStatus(200);
    } catch(err) {

    }
});

export { router as groupController };
