import { TechVocabulary } from '@/features/english/TechVocabulary';
import Link from 'next/link';

export default function EnglishVocabPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/courses" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Назад к курсам
          </Link>
          <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 rounded-full px-3 py-1">
            📚 Технический английский
          </span>
        </div>
        <TechVocabulary />
      </div>
    </div>
  );
}
