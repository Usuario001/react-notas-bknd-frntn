import express from 'express';
import cors from 'cors'

const app = express()

const port = process.env.PORT ?? 3000

app.use(cors())

app.post('/api/files', (req, res) => {
    res.status(200)
})

app.get('/api/users', (req, res) => {
    res.status(200).json({ data: [] })
})

app.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
  });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})


