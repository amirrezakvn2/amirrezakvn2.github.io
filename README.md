# Photography portfolio

Live at https://amirrezakvn2.github.io

## Updating the site

Everything you normally change is in **`content.js`**: name, tagline, bio, contact, and the list of series and photos.

### Add or replace photos
1. Export JPGs at about **2000 px on the long side**, quality ~80 (aim for under 500 KB each).
2. Put them in the series folder, e.g. `images/series-1/`.
3. List the file names in that series' `photos` in `content.js`, in the order you want them shown.
4. Photos are 4:3 landscape by default. For a vertical one write `{ file: "07.jpg", vertical: true }`.
5. Optional caption: `{ file: "03.jpg", caption: "Milan, 2026" }`.

### Add a series
Create a folder in `images/`, then copy one block inside `SERIES` in `content.js` and change `id` to the folder name.

### Publish from Termux
```
git add .
git commit -m "Update portfolio"
git push
```
The site updates about a minute after pushing.
