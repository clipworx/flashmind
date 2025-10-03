import dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'http'
import next from 'next'
import { parse } from 'url'
import type { IncomingMessage, ServerResponse } from 'http'

const dev = process.env.NODE_ENV !== 'production'
const appdev = next({ dev })
const handle = appdev.getRequestHandler()

appdev.prepare().then(async () => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true)
    handle(req, res, parsedUrl)
  })

  const PORT = parseInt(process.env.PORT || '3000', 10)
  server.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  })
  
}).catch((err) => {
  console.error('❌ Error starting server:', err)
  process.exit(1)
})

