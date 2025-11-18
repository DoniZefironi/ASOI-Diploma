// pages/index.tsx
import CodeEditor from '../components/CodeEditor';
import OutputDisplay from '../components/OutputDisplay';
import SandboxControls from '../components/SandboxControls';

export default function Home() {
  return (
    <div className="p-4 w-4/5 mx-auto">
      <h1 className="text-2xl font-bold mb-4">JS Sandbox</h1>
      <SandboxControls />
      <div className='flex gap-10'>
        <CodeEditor />
        <OutputDisplay />
      </div>
    </div>
    
  );
}