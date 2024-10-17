import ContentSection from "./ContentSection"
import TopBar from "./TopBar"

function MainSection() {
  return (
    <div className="w-[85%] flex flex-col h-screen">
      <TopBar />
      <ContentSection />
    </div>
  )
}

export default MainSection