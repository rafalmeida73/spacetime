import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify({ logger: true })

app.register(cors, {
  origin: true,
  // origin: ["http://localhost:3000", "http://localhost:3001"],
})
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then((address) => {
    console.log(`Server is listening on ${address}`)
  })
