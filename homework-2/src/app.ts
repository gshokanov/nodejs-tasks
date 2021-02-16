import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import * as express from 'express';
import { config } from './config/config';
import { UserModel } from './models/user.model';
import { userController } from './controllers/user.controller';
import { groupController } from './controllers/group.controller';
import { GroupModel } from './models/group.model';
import { UserGroupModel } from './models/user-group.model';

const sequelize = new Sequelize(config.databaseUri, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true
        }
    },
    ssl: true,
    models: [UserModel, GroupModel, UserGroupModel]
});

sequelize.authenticate().then(() => console.info('Connected to databse'));

const app = express();

app.use(express.json());

app.use('/api/user', userController);
app.use('/api/group', groupController);

app.all('*', (req, res) => res.sendStatus(404));

app.listen(config.port, () => console.info(`Server started on port ${config.port}`));
