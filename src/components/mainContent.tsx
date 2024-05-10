import ListContent from "./ListContent";
import Sidebar from "./sidebar";

export default async function MainContent() {
  return (
    <div className="flex h-screen bg-gray-50 border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <Sidebar />
      <ListContent />
    </div>
  )
}