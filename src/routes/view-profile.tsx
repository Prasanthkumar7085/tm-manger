import ViewProfile from '@/components/viewprofile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/view-profile')({
  component: () => 
  <div>
    <ViewProfile/>
  </div>,
})
