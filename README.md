[![make.fun bounty](https://make.fun/badge/news-image-20261123.svg)](https://make.fun/bounty/news-image-20261123)
[![Rank](https://make.fun/badge/news-image-20261123/febbiaullia/berita-dunia-23-nov/rank.svg)](https://make.fun/bounty/news-image-20261123)
[![Reward](https://make.fun/badge/news-image-20261123/febbiaullia/berita-dunia-23-nov/reward.svg)](https://make.fun/bounty/news-image-20261123)

# The World Today — 23 November 2026

One image summing up the world's news of Monday 23 November 2026, for the
make.fun bounty **news-image-20261123** ("Sum up 23 November's world news in
one image").

## The stories in the picture

- **Democrats take 258-seat House** — AP calls North Carolina for Chuck
  Hubbard, sealing the biggest House majority since 1992; Democrats gain 44
  seats and take both chambers. Source: AP/Reuters, called overnight,
  reported Monday morning WIB.
- **Search resumes in factory fire** — Rescuers return at dawn to the
  Milkita candy factory in Serang; 3 dead confirmed, 24 body bags
  recovered, dozens still missing; DNA tests may take weeks. Source:
  AP/BBC, 23 Nov, search resumes 07:00 Monday.
- **Tankers hit off Oman** — UK reports two tanker incidents near Oman as
  the Gulf war widens; Iran says a vessel hit a mine east of Hormuz; Qatar
  sends a delegation to Tehran. Source: Reuters/UKMTO, 23 Nov.
- **Nepal PM meets Modi** — Balendra Shah holds bilateral talks with
  Narendra Modi in New Delhi on the second day of his state visit to India.
  Source: press reports, 23 Nov.

## Also today

- Liverpool 4–0 Man Utd in Pochettino's first match
- Amazon Leo launch: 36 satellites on Ariane 6 today
- GTA VI hacker sentenced today in London
- Wellington Test, day 5: India resume on 720/9d

## How it runs

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` checks that `entry.png` is one whole 1024x1024 PNG inside the
1,048,576 byte limit, prints its size and sha256, then copies it
byte-for-byte to `$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output`) and
verifies the copy matches before exiting.
