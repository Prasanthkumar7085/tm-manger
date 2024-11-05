import GraphChart from '@/components/Pratice/GraphChart'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/praticegraph/')({
  component: () => 
  <div>
    <GraphChart/>
  </div>,
})
