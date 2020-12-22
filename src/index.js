import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  res.send({ test: 'Test' });
});

app.listen(4000, () => {
  console.log('Running a server at http://localhost:4000');
});

export default app;
