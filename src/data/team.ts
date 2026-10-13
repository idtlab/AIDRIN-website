// Photos live in /public/team (square, 320px+). Without a `photo` the card falls back to initials.
// `url` = personal site, `orcid`/`scholar` = full profile links, `email` = plain address.
export type Member = { name: string; org: string; url?: string; orcid?: string; scholar?: string; email?: string; photo?: string };

export const team: Member[] = [
  { name: "Suren Byna",     org: "The Ohio State University", url: "https://sbyna.github.io/", email: "byna.1@osu.edu",
    orcid: "https://orcid.org/0000-0003-3048-3448", scholar: "https://scholar.google.com/citations?user=EnK8668AAAAJ", photo: "/team/suren-byna.png" },
  { name: "Jean Luca Bez",  org: "Lawrence Berkeley National Laboratory", url: "https://jeanlucabez.io", email: "jlbez@lbl.gov",
    orcid: "https://orcid.org/0000-0002-3915-1135", scholar: "https://scholar.google.com/citations?user=2bhFfeoAAAAJ", photo: "/team/jean-luca-bez.png" },
  { name: "Kaveen Hiniduma", org: "The Ohio State University", url: "https://kaveenh.github.io/",
    orcid: "https://orcid.org/0009-0006-8516-0215", scholar: "https://scholar.google.com/citations?user=Q5TgY0cAAAAJ", photo: "/team/kaveen-hiniduma.jpg" },
  { name: "Ravi Madduri",   org: "Argonne National Laboratory", url: "https://www.anl.gov/profile/ravi-k-madduri",
    orcid: "https://orcid.org/0000-0003-2130-2887", scholar: "https://scholar.google.com/citations?user=1NoINjMAAAAJ", photo: "/team/ravi-madduri.jpg" },
  { name: "Abdullah Al Raqibul Islam", org: "The Ohio State University", url: "https://biqar.github.io",
    orcid: "https://orcid.org/0000-0002-0174-0807", scholar: "https://scholar.google.com/citations?user=H8zsAR8AAAAJ", photo: "/team/raqibul-islam.jpg" },
];

// Same shape as `team`: a chip links out when it has a `url`, and drops the org when it has none.
// Drawn from the AIDRIN commit history plus the names Suren flagged. The page sorts these by surname.
export const collaborators: Member[] = [
  { name: "Houjun Tang",   org: "Lawrence Berkeley National Laboratory", url: "https://go.lbl.gov/tang" },
  { name: "Wes Brewer",    org: "Oak Ridge National Laboratory", url: "https://www.ornl.gov/staff/wes-h-brewer/" },
  { name: "Zilinghan Li",  org: "Argonne National Laboratory" },
  { name: "Dylan Ryan",    org: "The Ohio State University" },
  { name: "Harish Balaji", org: "New York University" },
  { name: "Dhanushkumar Jayakumar", org: "New York University" },
  { name: "Beojan Stanislaus", org: "Lawrence Berkeley National Laboratory" },
  { name: "Paolo Calafiura", org: "Lawrence Berkeley National Laboratory" },
];
