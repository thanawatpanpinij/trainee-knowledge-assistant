import { z } from 'zod'
import { UIMessage } from 'ai'

export const chatRequestSchema = z.object({
  messages: z.custom<UIMessage[]>((val) => Array.isArray(val)),
  chatId: z.string().nullish(),
  fileContext: z.string().nullish(),
})

export type ChatRequest = z.infer<typeof chatRequestSchema>
