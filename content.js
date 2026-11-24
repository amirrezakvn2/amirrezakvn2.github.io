/*
  Edit this file to update the site. No other file needs changing.

  - Put photos in images/<series-folder>/ and list their file names below.
  - Most photos are 4:3 landscape. For a vertical photo add  vertical: true.
  - "cover" is the image shown on the home page for that series.
*/

const SITE = {
  name: "Your Name",
  tagline: "Street and documentary photography — Milan",
  email: "you@example.com",
  instagram: "yourhandle",          // without the @
  about: [
    "Short bio placeholder. One or two sentences on who you are and what you photograph.",
    "A second line about what draws you to the street, where you are based, and what you are working on now."
  ],
  aboutPhoto: "images/about/portrait.jpg"
};

const SERIES = [
  {
    id: "series-1",
    title: "Series Title One",
    year: "2026",
    place: "Milan",
    statement: "A short statement about this series: what it is about, where and when it was made, and why. Two to four sentences is enough.",
    cover: "01.jpg",
    photos: [
      { file: "01.jpg" },
      { file: "02.jpg" },
      { file: "03.jpg" },
      { file: "04.jpg" },
      { file: "05.jpg" },
      { file: "06.jpg" },
      { file: "07.jpg" },
      { file: "08.jpg" }
    ]
  },
  {
    id: "series-2",
    title: "Series Title Two",
    year: "2025",
    place: "City, Country",
    statement: "A short statement about this series.",
    cover: "01.jpg",
    photos: [
      { file: "01.jpg" },
      { file: "02.jpg" },
      { file: "03.jpg", vertical: true },
      { file: "04.jpg" },
      { file: "05.jpg" },
      { file: "06.jpg" }
    ]
  },
  {
    id: "series-3",
    title: "Series Title Three",
    year: "2024–2026",
    place: "Ongoing",
    statement: "A short statement about this series.",
    cover: "01.jpg",
    photos: [
      { file: "01.jpg" },
      { file: "02.jpg" },
      { file: "03.jpg" },
      { file: "04.jpg" },
      { file: "05.jpg" },
      { file: "06.jpg" }
    ]
  }
];
