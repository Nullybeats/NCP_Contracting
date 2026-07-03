export type ProjectCategory = 'residential' | 'commercial' | 'new-construction' | 'remodel'

export type MarketingProject = {
  slug: string
  title: string
  categories: ProjectCategory[]
  location: string
  year?: number
  scope: string[]
  description: string
  cover: string
  gallery: string[]
  video?: { src: string; poster: string }
}

const GALLERY = '/projects/gallery'

// TODO(nicholas): tune titles / locations / scope per photo. Framework is here.
export const PROJECTS: MarketingProject[] = [
  {
    slug: 'sdf-renn',
    title: 'SDF Renn Building',
    categories: ['commercial', 'remodel'],
    location: 'St. Petersburg, FL',
    year: 2026,
    scope: [
      'Full interior renovation',
      'Painter coordination + finishes',
      'Multi-trade subcontractor management',
    ],
    description:
      'Commercial interior renovation with layered finish work, coordinated across framing, drywall, paint, and MEP trades. Multi-building scope managed under a single-source turnkey delivery.',
    cover: `${GALLERY}/IMG_7793.jpg`,
    gallery: [
      `${GALLERY}/IMG_7793.jpg`,
      `${GALLERY}/IMG_7794.jpg`,
      `${GALLERY}/IMG_7556.jpg`,
      `${GALLERY}/IMG_7133.jpg`,
    ],
    video: { src: `${GALLERY}/IMG_2707.mp4`, poster: `${GALLERY}/IMG_2707-poster.jpg` },
  },
  {
    slug: 'super-8-buildout',
    title: 'Super 8 Buildout',
    categories: ['commercial', 'new-construction'],
    location: 'Tampa Bay, FL',
    year: 2026,
    scope: [
      'Commercial buildout',
      'Ground-up delivery',
      'Owner-ready handoff',
    ],
    description:
      'Ground-up commercial buildout delivered on schedule with full permit management, MEP coordination, and closeout documentation. Turnkey scope from preconstruction through final walkthrough.',
    cover: `${GALLERY}/IMG_1653.jpg`,
    gallery: [
      `${GALLERY}/IMG_1653.jpg`,
      `${GALLERY}/IMG_1659.jpg`,
      `${GALLERY}/IMG_1662.jpg`,
      `${GALLERY}/IMG_1663.jpg`,
    ],
    video: { src: `${GALLERY}/IMG_2699.mp4`, poster: `${GALLERY}/IMG_2699-poster.jpg` },
  },
  {
    slug: 'residential-remodel-01',
    title: 'Residential Interior Remodel',
    categories: ['residential', 'remodel'],
    location: 'Tampa Bay, FL',
    scope: ['Interior remodel', 'Custom finishes', 'Trim + paint'],
    description:
      'Full-service residential remodel with careful attention to finish carpentry, paint quality, and existing structure preservation. Delivered on time, cleaned up daily.',
    cover: `${GALLERY}/IMG_7123.jpg`,
    gallery: [
      `${GALLERY}/IMG_7123.jpg`,
      `${GALLERY}/IMG_7124.jpg`,
      `${GALLERY}/IMG_7125.jpg`,
      `${GALLERY}/IMG_7128.jpg`,
    ],
    video: { src: `${GALLERY}/IMG_2288.mp4`, poster: `${GALLERY}/IMG_2288-poster.jpg` },
  },
]

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  'new-construction': 'New Construction',
  remodel: 'Remodel',
}

export function findProject(slug: string): MarketingProject | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function relatedProjects(current: MarketingProject, limit = 2): MarketingProject[] {
  return PROJECTS.filter((p) => p.slug !== current.slug)
    .sort((a, b) => {
      const aScore = a.categories.filter((c) => current.categories.includes(c)).length
      const bScore = b.categories.filter((c) => current.categories.includes(c)).length
      return bScore - aScore
    })
    .slice(0, limit)
}
