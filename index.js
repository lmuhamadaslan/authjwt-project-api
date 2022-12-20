import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import UserRoute from './routes/UserRoute.js'

const app = express()

// create middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

// create endpoint
app.use("/api/auth/", UserRoute)

app.listen(5000, () => {
    console.log("Server up and running on port 5000")
})