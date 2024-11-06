import ContentSection from "./ContentSection";
import TopBar from "./TopBar";

function MainSection() {
  return (
    <div className="w-[85%] flex flex-col h-screen overflow-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
      <TopBar />
      <ContentSection />
    </div>
  );
}

export default MainSection;
