import { Play, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Slides generated', value: '48k+' },
  { label: 'Avg. build time', value: '38s' },
  { label: 'Teams onboarded', value: '1.2k+' },
  { label: 'Exports this week', value: '9.4k' },
]

function Hero() {
  const { user } = useUser()

  return (
    <div className="flex flex-col gap-8 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
        <Sparkles className="h-4 w-4" />
        Instant design + structure
      </div>

      <div className="space-y-4">
        <h1 className="text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          From idea to <span className="text-primary">presentation</span> in one click ⚡
        </h1>
        <p className="text-center text-lg text-muted-foreground sm:text-xl">
          Generate sleek, editable PPT decks in minutes. The AI handles slide layout, imagery, and pacing so you can focus on the story.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        {!user ? (
          <SignInButton mode="modal">
            <Button size="lg" className="shadow-lg shadow-primary/25">
              Get started free
            </Button>
          </SignInButton>
        ) : (
          <Link to="/workspace">
            <Button size="lg" className="shadow-lg shadow-primary/25">
              Go to workspace
            </Button>
          </Link>
        )}

        <Button variant="outline" size="lg" className="border-primary/40 text-primary">
          <Play className="mr-2 h-4 w-4" /> Watch demo
        </Button>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 text-left sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-white/70 p-3 text-center shadow-sm backdrop-blur dark:bg-slate-900/70"
          >
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white via-white to-slate-50 p-3 shadow-xl shadow-primary/10 backdrop-blur dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="grid gap-3 sm:grid-cols-5 sm:items-center">
          <div className="space-y-1 text-left sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">See it in action</p>
            <p className="text-sm text-muted-foreground">One prompt to outline, design, and export. No templates to wrestle.</p>
          </div>
          <div className="sm:col-span-3">
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://img.youtube.com/vi/qh3NGpYRG3I/maxresdefault.jpg"
              thumbnailAlt="Hero Video"
              className="w-full overflow-hidden rounded-xl border border-border"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
 