import express from 'express';
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = process.env.PORT ?? 3000

const storage = multer.memoryStorage()
const upload = multer({storage})

let userData: Array<Record<string, string>> = []

app.use(cors())

app.post('/api/files', upload.single('file'), async (req, res) => {
    //1) Extract file from request
    const { file } = req
    //2) Validate that we have the file
    if(!file){
        res.status(500).json({message:'File is required'})
        return;
    }
    //3) Validate the mimetype is only CSV 
    if(file.mimetype !== 'text/csv'){
        res.status(500).json({message:'File must be a CSV type'})
        return;
    }
    let json: Array<Record<string,string>>
    try{
        //4) Transform CSV to string (with buffer)
        const rawCsv = Buffer.from(file.buffer).toString('utf-8')
        //5) Transform string to json
        json = csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }catch(error){
        res.status(500).json({message:'Error parsing the file'})
        return;
    }
    //save json to DB (not yet just in memory xD)
    userData = json
    //return 200 with the message and the json 
    res.status(200).json({data:json, message:'File was upload succesfully'})
    return;
})


app.get('/api/users', async (req, res) => {
    //1) Extract the query param from request
    const { q } = req.query
    console.log(q)
    //2) Validate that we have the query
    if ( !q ){
        res.status(500).json({message:'Query param `q` is required'})
        return;
    }

    if( Array.isArray(q) ){
        res.status(500).json({message:'Query q must be a string'})
        return;
    }

    //3) Filter the data from the DB (Not yet xD) or the memory with the query param
    const search = q.toString().toLowerCase()

    const filteredData = userData.filter(row => {
        return Object
        .values(row)
        .some(value => value.toLowerCase().includes(search))
    })
    //4) Return 200 with the filtered data
    res.status(200).json({ data: filteredData })
})

//just to see something in the webpage
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})


