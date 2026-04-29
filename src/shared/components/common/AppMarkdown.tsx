import { cn } from '@shared/utils/tailwindClass'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AppMarkdownProps {
  content: string
  className?: string
}

export default function AppMarkdown({ content, className }: AppMarkdownProps) {
  return (
    <div
      className={cn(
        'prose prose-sm md:prose-base wrap-break-words max-w-none',
        className
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  )
}
