#import "@preview/hydra:0.6.2": hydra

// Monticello ships as two families: the roman and the italic have different names.
#let roman = "MonticelloLTW01-Roman"
#let italic = "MonticelloLTW01"
#let dark = rgb("#222")

// appendices are set like any other chapter
#let appendix(body) = body

#let article(
  cover: none,
  title: "",
  subtitle: "",
  author: "",
  date: "",
  dt: none,
  abstract: none,
  doc,
) = {
  let has-cover = cover != none and cover != ""
  set document(
    title: title,
    author: author,
    date: dt,
  )
  set page(
    paper: "a4",
    margin: 2cm,
    header: context {
      let start-page = query(<body-start>).first().location().page()
      // hydra yields none when a chapter starts on this page
      let running = hydra(1)
      if here().page() >= start-page and running != none {
        set text(size: 9pt)
        h(1fr)
        running
      }
    },
    footer: context {
      let start-page = query(<body-start>).first().location().page()
      if here().page() >= start-page {
        set text(size: 10pt)
        h(1fr)
        counter(page).display("1")
      }
    },
  )
  set text(font: roman, size: 11pt)
  show emph: set text(font: italic)
  // book paragraphs: no space between them, each one after the first indented
  set par(
    justify: true,
    leading: 0.65em,
    spacing: 0.65em,
    first-line-indent: 2em,
  )
  set list(indent: 1em)
  set enum(indent: 1em)
  show list: it => block(spacing: 1em, it)
  show enum: it => block(spacing: 1em, it)
  show figure: set block(spacing: 2em)
  show link: underline
  show quote: set text(font: italic, style: "italic")
  show heading: set text(font: roman, weight: "regular", hyphenate: false)
  show heading: set par(justify: false, leading: 0.5em, first-line-indent: 0pt)
  show heading.where(level: 1): set text(size: 48pt)
  show heading.where(level: 1): set block(below: 2em)
  show heading.where(level: 1): it => pagebreak(weak: true) + it
  show heading.where(level: 2): set text(size: 14pt)
  show heading.where(level: 2): set block(above: 1.6em, below: 0.4em)
  show heading.where(level: 3): set text(size: 12pt)
  show heading.where(level: 4): set text(size: 11pt)
  show heading.where(level: 5): set text(size: 11pt, font: italic, style: "italic")
  show heading.where(level: 6): set text(size: 11pt, font: italic, style: "italic")
  // footnotes: body sits to the right of its number rather than wrapping under it
  show footnote.entry: it => {
    let loc = it.note.location()
    let num = numbering(it.note.numbering, ..counter(footnote).at(loc))
    set par(justify: false, first-line-indent: 0pt)
    grid(
      columns: (1.4em, 1fr),
      super(num),
      it.note.body,
    )
  }
  // scene breaks
  show "⁂": it => box(inset: (y: 1em), it)

  // TITLE
  // Text on a white background only when there is a cover image to stand out from.
  let plate(body) = block(
    fill: if has-cover { white } else { none },
    inset: if has-cover { 5mm } else { 0pt },
    body,
  )
  page(
    margin: 1.5cm,
    header: none,
    footer: none,
    background: if has-cover { image(cover, width: 100%, height: 100%) },
    {
      set par(leading: 0.3em, first-line-indent: 0pt)
      plate(text(size: 40pt, title))
      if subtitle != "" {
        plate(text(size: 16pt, fill: dark, subtitle))
      }
      if author != "" or date != "" {
        v(2em)
        for item in (author, date).filter(x => x != "") {
          plate(text(size: 16pt, fill: dark, item))
        }
      }
    }
  )

  // ABSTRACT
  if abstract != none {
    page(
      header: none,
      footer: none,
      {
        set text(font: italic, style: "italic", size: 10pt)
        align(horizon, abstract)
      }
    )
  }

  counter(page).update(1)
  [#metadata(none) <body-start>]
  doc
}
