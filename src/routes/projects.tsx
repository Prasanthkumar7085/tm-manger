import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: () => <div>Hello /projects!</div>,
})
