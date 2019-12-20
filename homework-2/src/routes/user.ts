import { Router } from 'express';
import { UserModel } from '../models/user/user-model';

const userModel = new UserModel();

const router = Router();

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const user = userModel.getById(id);
    if (!user) {
        return res.sendStatus(404);
    }
    res.json(user);
});

router.post('/', (req, res) => {
    const user = req.body;
    const id = userModel.create(user);
    res.status(201).send(id);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const user = req.body;
    const result = userModel.update(id, user);
    if (result) {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const result = userModel.delete(id);
    if (result) {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

export { router as userRouter };
