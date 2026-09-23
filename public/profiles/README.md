# Profile photos

Drop one photo per audience here, named to match `photoUrl` in
[`src/app/data/audiences.data.ts`](../../src/app/data/audiences.data.ts):

- `recruiter.jpg`
- `friend.jpg`
- `developer.jpg`
- `curious.jpg`
- `guru.jpg`

Anything in `public/` is served from the site root as-is, so
`profiles/recruiter.jpg` becomes `/profiles/recruiter.jpg` at runtime —
no build config changes needed. Until a file exists, the site falls back
to the audience's emoji icon automatically.
