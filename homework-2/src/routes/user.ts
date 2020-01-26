import { Router, Response } from 'express';
import { UserModel } from '../models/user/user-model';
import { userSchema, autoSuggestListSchema } from '../models/user/user-schema';

const userModel = new UserModel();

const router = Router();

const handleMissingUser = (res: Response) => res.status(404).json({
    message: 'User does not exist'
});

router.get('/autosuggest', (req, res) => {
    const options = req.query;
    const { error } = autoSuggestListSchema.validate(options, {
        abortEarly: false
    });
    if (error) {
        return res.status(400).json(error.details);
    }
    const result = userModel.getAutoSuggestedUsers(options.loginSubstring, options.limit);
    if (result.length === 0) {
        return res.sendStatus(404);
    }
    res.json(result);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const user = userModel.getById(id);
    if (!user) {
        return handleMissingUser(res);
    }
    res.json(user);
});

router.post('/', (req, res) => {
    const user = req.body;
    const { error } = userSchema.validate(user, {
        abortEarly: false
    });
    if (error) {
        return res.status(400).json(error.details);
    }
    const id = userModel.create(user);
    res.status(201).send(id);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const user = req.body;
    const { error } = userSchema.validate(user, {
        abortEarly: false
    });
    if (error) {
        return res.status(400).json(error.details);
    }
    const result = userModel.update(id, user);
    if (result) {
        res.sendStatus(200);
    } else {
        handleMissingUser(res);
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const result = userModel.delete(id);
    if (result) {
        res.sendStatus(200);
    } else {
        handleMissingUser(res);
    }
});

export { router as userRouter };
