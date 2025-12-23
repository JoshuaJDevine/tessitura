import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Canvas } from '@/components/Canvas/Canvas';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1">
        <Canvas />
      </div>
    </div>
  );
}

export default App;

