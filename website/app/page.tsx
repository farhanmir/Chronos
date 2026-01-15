import { HeroClient } from './components/HeroClient'
import { Features } from './components/Features'
import { Footer } from './components/Footer'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Inline GitHub API fetch to avoid module resolution issues
async function getDisplayDownloadCount(): Promise<number> {
  try {
    const response = await fetch('https://api.github.com/repos/farhanmir/Chronos/releases', {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Chronos-Website'
      }
    })

    if (!response.ok) return 0

    const releases = await response.json()
    let totalDownloads = 0
    if (Array.isArray(releases)) {
      releases.forEach((release: any) => {
        if (release.assets && Array.isArray(release.assets)) {
          release.assets.forEach((asset: any) => {
            totalDownloads += asset.download_count || 0
          })
        }
      })
    }
    return totalDownloads
  } catch {
    return 0
  }
}

export default async function Home() {
  const downloadCount = await getDisplayDownloadCount()
  
  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <HeroClient initialDownloadCount={downloadCount} />
      <Features />
      <Footer />
    </div>
  )
}
