import { Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { loginValidator } from '../middleware/validators';

const router = Router();

router.post('/', loginValidator, (req, res) => {
    const credentials = req.body;
    jwt.sign(credentials, config.secret, {
        expiresIn: '2h'
    }, (err, token) => {
        if (err) {
            return res.sendStatus(500);
        }
        res.send(token);
    });
});

export { router as loginController };
