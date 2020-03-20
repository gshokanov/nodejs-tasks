import { Router } from 'express';
import { DatabaseError } from 'sequelize';
import { UserService } from '../services/user.service';
import { logController } from '../middleware/log-controller';
import { userValidator, autoSuggestValidator } from '../middleware/validators';
import { controllerErrorHandler } from '../middleware/error-handler';
import { jwtAuthorization } from '../middleware/authorization';
import { globalRegistry } from '../config/registry';

const router = Router();
const service = globalRegistry.resolve(UserService);

router.use(logController('UserController'));

router.get('/autosuggest', jwtAuthorization, autoSuggestValidator, async (req, res, next) => {
    try {
        const { loginSubstring, limit } = req.query;
        const result = await service.autosuggestUsers(loginSubstring, limit);
        res.json(result);
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', jwtAuthorization, async (req, res, next) => {
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

router.put('/:id', jwtAuthorization, userValidator, async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.body;
        const result = await service.update(id, user);
        if (!result) {
            return res.sendStatus(404);
        }
        res.sendStatus(200);
    } catch (err) {
        if (err instanceof DatabaseError) {
            return res.sendStatus(404);
        }
        return next(err);
    }
});

router.delete('/:id', jwtAuthorization, async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await service.delete(id);
        if (!result) {
            return res.sendStatus(404);
        }
        res.sendStatus(200);
    } catch (err) {
        if (err instanceof DatabaseError) {
            return res.sendStatus(404);
        }
        return next(err);
    }
});

router.use(controllerErrorHandler('UserController'));

export { router as userController };
