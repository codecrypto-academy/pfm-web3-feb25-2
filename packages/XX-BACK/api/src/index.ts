import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';

process.loadEnvFile('src/.env');

const port = process.env.PORT || 3000;

const app = express();

// middleware to parse JSON
app.use(express.json());

// middleware to allow cross-origin requests
//app.use(cors());

const corsOptions = {
    origin: 'http://localhost:3001', // Puerto donde corre tu frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  app.use(cors(corsOptions));


  app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://localhost:3000; connect-src 'self' http://localhost:3001; font-src 'self' https://fonts.gstatic.com;"
    );
    next();
});


// routes
app.use("/", apiRoutes);

app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});


// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


