import app from './src/Config/app';
import { PORT } from './src/Constant';


app.get('/', (req, res) => {
    res.send('Welcome to My First NodeJs app with Typescript')
})

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
})