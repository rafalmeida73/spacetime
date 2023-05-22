import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from "zod"

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async (request, reply) => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })

    return memories.map((memory) => ({
      id: memory.id,
      coverUrl: memory.coverUrl,
      excerpt: memory.content.substring(0, 115).concat('...'),
    }))
  })

  app.get('/memories/:id', async (request, reply) => {

    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)


    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    return memory
  })

  app.post('/memories', async (request, reply) => {
    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string()
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        isPublic,
        coverUrl,
        userId: "5040faae-c20a-47f4-bfe2-538eaa344722"
      }
    })

    return memory
  })

  app.put('/memories/:id', async (request, reply) => {

    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string()
    })

    const { id } = paramsSchema.parse(request.params)
    const { content, coverUrl, isPublic } = bodySchema.parse(request.params)


    const memory = await prisma.memory.update({
      where: {
        id
      },
      data: {
        content,
        isPublic,
        coverUrl,
      }
    })

    return memory
  })

  app.delete('/memories/:id', async (request, reply) => {

    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.user.delete({
      where: {
        id
      }
    })

  })
}