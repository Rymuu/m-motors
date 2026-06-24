import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import vehicleRoutes from './routes/vehicle.routes.js'
import authRoutes from './routes/auth.routes.js'
import applicationRoutes from './routes/application.routes.js'
import documentRoutes from './routes/document.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'M-Motors API is running' })
})

app.use('/vehicles', vehicleRoutes)
app.use('/auth', authRoutes)
app.use('/applications', applicationRoutes)
app.use('/applications/:applicationId/documents', documentRoutes)
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})