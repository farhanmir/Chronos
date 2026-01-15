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
            <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="mb-4 p-3 bg-white/5 rounded-xl inline-block">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

