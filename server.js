const express = require('express')
const connectDB = require('./config/db')
const helmet = require('helmet')

const app = express()

//Connect DB
connectDB();

//Init Middleware
app.use(express.json({ extended: false }))


app.get('/', (req, res) => res.send('API Running'))

//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))

//Secutiy
app.use(helmet());

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))