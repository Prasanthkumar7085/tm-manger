import ForgotComponent from '@/components/auth/Forgot'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgot-password')({
  component: () => 
  <div>
    <ForgotComponent/>
  </div>,
})
