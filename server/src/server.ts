import "dotenv/config"
import { fastify } from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from "./routes/auth"

const app = fastify({ logger: true })

app.register(cors, {
  origin: true,
  // origin: ["http://localhost:3000", "http://localhost:3001"],
})
app.register(jwt, {
  secret: "spacetime"
})
app.register(memoriesRoutes)
app.register(authRoutes)

app
  .listen({
    port: 3333,
    host: "0.0.0.0"
  })
  .then((address) => {
    console.log(`Server is listening on ${address}`)
  })
