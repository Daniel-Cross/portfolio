import { Badge } from "@/components/ui/badge"
import { skillGroups } from "@/content/skills"

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h2 className="text-2xl font-semibold md:text-3xl">Skills</h2>
      <div className="mt-8 flex flex-col gap-6">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="font-mono text-sm text-muted-foreground">
              {group.label}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
