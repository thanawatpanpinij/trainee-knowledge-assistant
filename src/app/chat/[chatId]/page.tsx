import { ChatWorkspace } from '@shared/components'

interface Props {
  params: Promise<{ chatId: string }>
}

export default async function HistoryChatPage({ params }: Props) {
  const { chatId } = await params

  return <ChatWorkspace chatId={chatId} />
}
