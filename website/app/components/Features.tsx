import { Zap, Moon, Cpu } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      title: 'Token Bucket Rate Limiting',
      description: 'Sophisticated 60 RPM token bucket algorithm that ensures maximal throughput without hitting API bans.',
    },
    {
      icon: <Moon className="w-6 h-6 text-purple-400" />,
      title: 'Autonomous YOLO Mode',
      description: 'Enable --yolo for fully autonomous execution. Chronos handles permissions and confirmations so you can sleep.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: 'Built for Speed',
      description: 'Leverages massive context windows for complex refactoring tasks without interruptions.',
    },
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0A0A0C] to-[#111115] border-t border-white/5 relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="max-w-[1000px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative p-8 rounded-2xl bg-[#0A0A0C]/90 border border-white/10 hover:border-white/20 transition-all duration-300 h-full backdrop-blur-xl">
                <div className="mb-6 p-4 bg-gradient-to-br from-white/5 to-white/0 rounded-xl inline-block ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-indigo-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

