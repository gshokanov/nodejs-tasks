import * as express from 'express';
import { userRouter } from './routes/user';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/api/user', userRouter);

app.all('*', (req, res) => res.sendStatus(404));

app.listen(PORT, () => console.info(`Server started on port ${PORT}`));
