/* Facet / media — the real-content system for demo surfaces.
   Demo stages render real photography and product-shaped data so the
   library reads as shipped UI, not props. Photos ship with the
   package from /public/photos — no third-party CDN at runtime. */

/* landscape photography for card media, covers and rails */
export const PHOTOS = {
  forest: "/photos/forest.jpg",
  ridge: "/photos/ridge.jpg",
  peak: "/photos/peak.jpg",
  night: "/photos/night.jpg",
  lake: "/photos/lake.jpg",
  coast: "/photos/coast.jpg",
};

/* portrait photography for avatars and social surfaces */
export const FACES = {
  a: "/photos/face-a.jpg",
  b: "/photos/face-b.jpg",
  c: "/photos/face-c.jpg",
  d: "/photos/face-d.jpg",
  e: "/photos/face-e.jpg",
};

/* the diagonal rail cycles landscape work */
export const RAIL = [PHOTOS.ridge, PHOTOS.coast, PHOTOS.night, PHOTOS.peak, PHOTOS.lake, PHOTOS.forest];

/* plausible people for testimonial-shaped surfaces */
export const PEOPLE = [
  { name: "Mara Ellison", role: "Design lead, Latch", img: FACES.a },
  { name: "Theo Brandt", role: "Engineer, Parallax", img: FACES.b },
  { name: "Ines Rykov", role: "Founder, Fieldnote", img: FACES.c },
  { name: "Dev Anand", role: "Staff designer, Vela", img: FACES.d },
  { name: "Jun Park", role: "Frontend, Monolith", img: FACES.e },
];

/* a believable quote — enough voice to read real, short enough
   to fit card footers at any variant scale */
export const QUOTE =
  "We shipped the redesign in a week. The primitives were already the hard part — motion, focus states, the lot.";
