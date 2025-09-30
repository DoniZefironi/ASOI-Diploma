'use client';

export const Footer = () => {
  return (
    <footer className="bg-[#0D1117] text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-12">
            <ul className="flex justify-center items-center gap-10">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/contacts" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
        </div>
      </div>
    </footer>
  );
};