export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-[#030014]">
      <div className="max-w-[700px] mx-auto text-center">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 flex-wrap mb-4">
          <a href="#" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Support
          </a>
        </div>
        <div className="text-sm text-gray-700">
          Open Source · Powered by Chronos
        </div>
      </div>
    </footer>
  )
}

