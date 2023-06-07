import fs from 'fs';
import path from 'path';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import admin from 'firebase-admin';

import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import reportRouter from './routes/report.routes.js';

const serviceAccountPath = path.join(path.resolve(), 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
 res.send({ message: 'Hello World!' });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/reports', reportRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URl);

    app.listen(8080, () => 
    console.log(
        'Server started on port http://localhost:8080'));
  } catch (error) {
    console.log(error);
  }
}

startServer();
