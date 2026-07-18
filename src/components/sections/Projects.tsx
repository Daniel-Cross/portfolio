import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { LiveAppFrame } from "@/components/ui/live-app-frame"
import { PhoneFrame } from "@/components/ui/phone-frame"
import { projects } from "@/content/projects"

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold md:text-3xl">Projects</h2>
      <div className="mt-8 flex flex-col gap-8">
        {projects.map((project, index) => {
          const isLive = project.slug === "football-alpha"
          return (
            <article
              key={project.slug}
              className="flex flex-col gap-6 rounded-lg border-l-4 border-accent bg-card p-6 md:flex-row md:items-center"
            >
              {isLive ? (
                <LiveAppFrame
                  url={project.links[0]!.href}
                  title={`${project.name} live app`}
                  links={project.links}
                />
              ) : (
                <PhoneFrame
                  src={project.screenshot}
                  alt={`${project.name} screenshot`}
                  priority={index === 0}
                />
              )}
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p className="text-muted-foreground">{project.blurb}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-mono">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {!isLive && (
                  <div className="flex flex-wrap gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
