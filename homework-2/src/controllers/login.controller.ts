import { Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { loginValidator } from '../middleware/validators';
import { globalRegistry } from '../config/registry';
import { UserService } from '../services/user.service';

const router = Router();
const userService = globalRegistry.resolve(UserService);

router.post('/', loginValidator, async (req, res) => {
    const credentials = req.body;
    const user = await userService.login(credentials);
    if (!user) {
        return res.sendStatus(403);
    }
    const tokenUser = {
        sub: user.id,
        login: user.login,
        age: user.age
    };
    jwt.sign(tokenUser, config.secret, {
        expiresIn: '2h'
    }, (err, token) => {
        if (err) {
            return res.sendStatus(500);
        }
        res.send(token);
    });
});

export { router as loginController };
