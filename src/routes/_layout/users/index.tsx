import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/users/')({
  component: () => <div>Hello /_layout/users/!</div>,
})
