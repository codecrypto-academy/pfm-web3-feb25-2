import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes.ts';
import { loadEnvFile, env } from 'node:process';

loadEnvFile('src/.env');

const port = env.PORT || 3000;

const app = express();

// middleware to parse JSON
app.use(express.json());

// middleware to allow cross-origin requests
app.use(cors());

// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// routes
app.use("/", apiRoutes);
