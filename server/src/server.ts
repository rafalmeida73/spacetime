import "dotenv/config"

import { fastify } from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from "./routes/auth"
import multipart from "@fastify/multipart"
import { uploadRoutes } from "./routes/upload"
import { resolve } from "path"

const app = fastify({ logger: true })

app.register(multipart)

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads/",
})


app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: "spacetime"
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)


app
  .listen({
    port: 3333,
    host: "0.0.0.0"
  })
  .then((address) => {
    console.log(`Server is listening on ${address}`)
  })
