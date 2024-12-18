import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { config } from 'dotenv';

config();

const PORT = 3300;

const TARGET = process.env.PROXY_TARGET || '';

const app = express();
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', async (req: Request, res: Response) => {
  try {
    const url = `${TARGET}${req.originalUrl}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in proxy request', error);
    res.status(500).json({ message: 'Proxy error' });
  }
});

const port = PORT || 5000;
app.listen(port, () => {
  console.info(`server running on port ${port}`);
});
