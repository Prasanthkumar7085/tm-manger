import ResetPassword from '@/components/auth/ResetPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/reset-password')({
  component: () => 
  <div>
    <ResetPassword/>
  </div>
})
