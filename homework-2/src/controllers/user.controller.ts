import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { userValidator, autoSuggestValidator } from '../middleware/validators';
import { UserMapper } from '../data-access/user.mapper';

const router = Router();
const service = new UserService(UserModel, new UserMapper());

router.get('/autosuggest', autoSuggestValidator, async (req, res, next) => {
    try {
        const { loginSubstring, limit } = req.query;
        const result = await service.autosuggestUsers(loginSubstring, limit);
        res.json(result);
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await service.findById(id);
        if (!user) {
            return res.sendStatus(404);
        }
        res.json(user);
    } catch (err) {
        return next(err);
    }
});

router.post('/', userValidator, async (req, res, next) => {
    try {
        const user = req.body;
        const id = await service.create(user);
        res.status(201).send(String(id));
    } catch (err) {
        return next(err);
    }
});

router.put('/:id', userValidator, async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.body;
        const result = await service.update(id, user);
        if (!result) {
            return res.sendStatus(404);
        }
        res.sendStatus(200);
    } catch (err) {
        return next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await service.delete(id);
        if (!result) {
            return res.sendStatus(404);
        }
        res.sendStatus(200);
    } catch (err) {
        return next(err);
    }
});

export { router as userController };