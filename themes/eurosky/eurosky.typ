// Two-column memo with a brand band on the first page and a brand footer on the others.
#let brand = "eurosky"
#let brand-font = "Josefin Sans"
#let body-font = "Mulish"
#let logo = "./img/logo.png"
#let accent = rgb("#1A9BCC")
#let band = gradient.linear(rgb("#1B2847"), rgb("#126CB4"), angle: 90deg)
#let logo-in-band = true
#let dark = rgb("#222")

// no special treatment for appendices
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
  set document(
    title: title,
    author: author,
    date: dt,
  )
  set page(
    paper: "a4",
    margin: 2cm,
    columns: 2,
    // full-bleed band across the top of the first page
    background: context if here().page() == 1 {
      place(
        top + left,
        block(
          width: 100%,
          height: 2cm,
          fill: band,
          {
            if logo-in-band {
              place(top + left, dx: 0.5cm, dy: 0.6cm, image(logo, height: 0.8cm))
            }
            place(
              top + left,
              dx: 2cm, dy: 0.4cm,
              text(font: brand-font, size: 36pt, weight: 100, fill: white, brand),
            )
          },
        ),
      )
    },
    footer: context {
      set text(font: brand-font)
      if here().page() > 1 {
        box(baseline: 25%, image(logo, height: 0.7cm))
        h(0.15cm)
        text(size: 24pt, weight: 100, fill: accent, brand)
      }
      h(1fr)
      counter(page).display("1")
    },
  )
  set columns(gutter: 0.8cm)
  set text(font: body-font, size: 11pt)
  set par(justify: true, spacing: 1em)
  set list(indent: 1em)
  set enum(indent: 1em)
  show link: underline
  show heading: set text(hyphenate: false)
  show heading: set par(justify: false, leading: 0.5em)
  show heading.where(level: 1): set text(font: brand-font, weight: 200, size: 48pt)
  show heading.where(level: 1): set block(above: 48pt, below: 0.3em)
  show heading.where(level: 2): set text(weight: 700, size: 11pt)
  show heading.where(level: 2): set block(above: 1em, below: 0.4em)
  show heading.where(level: 3): set text(font: brand-font, weight: 400, size: 13pt)
  show heading.where(level: 3): set block(above: 1em, below: 0.4em)
  show heading.where(level: 4): set text(weight: 700, size: 11pt)
  show heading.where(level: 5): set text(weight: 700, size: 11pt, style: "italic")
  show heading.where(level: 6): set text(weight: 700, size: 11pt, style: "italic")
  // footnotes: body sits to the right of its number rather than wrapping under it
  show footnote.entry: it => {
    let loc = it.note.location()
    let num = numbering(it.note.numbering, ..counter(footnote).at(loc))
    set par(justify: false)
    grid(
      columns: (1.4em, 1fr),
      super(num),
      it.note.body,
    )
  }

  // TITLE, spanning both columns at the top of the first page
  place(
    top + left,
    scope: "parent",
    float: true,
    clearance: 1.5em,
    {
      set par(leading: 0.3em)
      v(1cm)
      block(text(font: brand-font, size: 42pt, weight: 200, title))
      if subtitle != "" {
        block(above: 0.5em, text(font: brand-font, size: 19pt, weight: 300, fill: dark, subtitle))
      }
      if author != "" or date != "" {
        block(above: 1em, text(size: 12pt, fill: dark, (author, date).filter(x => x != "").join(" · ")))
      }
      if abstract != none {
        v(0.5em)
        set text(size: 12pt)
        set par(leading: 0.65em)
        abstract
      }
    },
  )
  doc
}
