import { Sidebar } from '@/components/Sidebar/Sidebar';
import { CollectionView } from '@/components/Collection/CollectionView';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <CollectionView />
    </div>
  );
}

export default App;
