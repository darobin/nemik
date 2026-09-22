
#import "@preview/hydra:0.6.2": hydra

// appendix sections: no big gap between the heading and the content
#let appendix(body) = {
  show heading.where(level: 1): set block(below: 1em)
  body
}

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
    header: context {
      // top-most heading level actually used in the document
      let top = if query(heading.where(level: 1)).len() > 0 { 1 } else { 2 }
      let start-page = query(<body-start>).first().location().page()
      // hydra yields none when a top-level heading starts this page
      let running = hydra(top)
      if here().page() >= start-page and running != none [
        #h(1fr)
        _#running _
      ]
    },
    footer: context {
      let start-page = query(<body-start>).first().location().page()
      let this-page = here().page()
      if this-page >= start-page [
        #box(baseline: 40%, image("./img/asterism.png", width: 1.6em, height: 1.6em))
        #h(1fr)
        #counter(page).display("1")
      ]
    },
  )
  set text(
    font: "Mulish",
    size: 11pt,
    weight: 300,
  )
  set par(
    justify: true,
  )
  set list(indent: 1em)
  set enum(indent: 1em)
  show list: it => block(spacing: 1em, it)
  show enum: it => block(spacing: 1em, it)
  show figure: set block(spacing: 2em)
  // set heading(numbering: "1.")
  show heading: set text(font: "Cormorant", hyphenate: false)
  show heading: set par(justify: false, leading: 0.5em)
  show heading.where(level: 1): set text(
    weight: 300,
    size: 48pt,
  )
  show heading.where(level: 1): set block(
    below: 5em,
  )
  show heading.where(level: 1, body: [Executive Summary]): set block(below: 1em)
  // show: doc => context {
  //   let special-headings = query(heading.where(level: 1))
  //     .map(elt => elt.at("body", default: none))
  //     .filter(bod => bod != none and str(bod).match(regex("Executive Summary")) != none)
  //   // use a placeholder to make sure the list is never empty
  //   show selector.or(<supramundane-placeholder>, ..special-headings): set block(below: 1em)
  //   doc
  // }
  show heading.where(level: 1): it => pagebreak(weak: true) + it
  show heading.where(level: 2): set text(
    weight: 600,
    size: 22pt,
  )
  show heading.where(level: 3): set text(weight: 600, size: 17pt)
  show heading.where(level: 4): set text(weight: 600, size: 14pt)
  show heading.where(level: 5): set text(weight: 600, size: 12.5pt)
  show heading.where(level: 6): set text(weight: 600, size: 12pt, style: "italic")
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
  show "⁂": it => box(inset: (y: 2em), text(weight: 900, size: 22pt, "⁂"))
  // show "⁂": set text(weight: 900, size: 22pt)
  show link.where(body: regex("^http")): it => box(it)

  // COVER
  if cover != none and cover != "" {
    page(
      margin: 0pt,
      numbering: none,
      background: image(cover, width: 100%, height: 100%),
      [
        // title
        #place(
          top + left,
          dx: 1cm, dy: 5cm,
          [
            #block(
              fill: rgb("#fff"),
              inset: (x: 5mm, y: 1cm),
              width: 19cm,
              text(
                font: "Catamaran",
                size: 4em,
                weight: 700,
                title,
              )
            )
            // subtitle
            #block(
              above: 1em,
              fill: rgb("#fff"),
              inset: 5mm,
              width: 19cm,
              text(
                font: "Catamaran",
                size: 1.6em,
                weight: 400,
                fill: rgb("#222"),
                subtitle,
              )
            )
            #place(
              right,
              dx: -1cm, dy: 2cm,
              [
                // author
                #block(
                  fill: rgb("#fff"),
                  inset: 5mm,
                  text(
                    font: "Catamaran",
                    size: 1.6em,
                    weight: 400,
                    fill: rgb("#222"),
                    author,
                  )
                )
                // date
                #block(
                  fill: rgb("#fff"),
                  inset: 5mm,
                  text(
                    font: "Catamaran",
                    size: 1.6em,
                    weight: 400,
                    fill: rgb("#222"),
                    date,
                  )
                )
              ]
            )
          ]
        )
        #place(
          bottom + left,
          dx: 0cm, dy: -1cm,
          block(
            fill: rgb("#fff"),
            inset: (top: 5mm, bottom: 0mm),
            width: 21cm,
            [
              #align(
                center,
                [
                  #image("./img/asterism.png", width: 4em, height: 4em)
                  #text(
                    font: "Cormorant",
                    size: 1.6em,
                    weight: 100,
                    baseline: -5mm,
                    [supramundane _agency_.],
                  )
                ]
              )
            ]
          )
        )
      ]
    )
  }
  else {
    // no cover image: compact, terse title page on white
    page(
      numbering: none,
      [
        #v(3cm)
        #text(
          font: "Catamaran",
          size: 26pt,
          weight: 700,
          title,
        )
        #if subtitle != "" {
          v(0.4em)
          text(
            font: "Catamaran",
            size: 14pt,
            weight: 400,
            fill: rgb("#222"),
            subtitle,
          )
        }
        #if author != "" or date != "" {
          v(1.2em)
          text(
            font: "Catamaran",
            size: 11pt,
            weight: 400,
            fill: rgb("#444"),
            (author, date).filter(x => x != "").join(" · "),
          )
        }
        #place(
          bottom + left,
          [
            #box(baseline: 40%, image("./img/asterism.png", width: 2em, height: 2em))
            #text(
              font: "Cormorant",
              size: 1.4em,
              weight: 100,
              [supramundane _agency_.],
            )
          ]
        )
      ]
    )
  }

  // ABSTRACT
  if abstract != none {
    page(
      numbering: none,
      {
        set text(
          style: "italic",
          size: 10pt
        )
        abstract
      }
    )
  }
  // TOC
  show outline: set heading(level: 2)
  show outline.entry.where(level: 1): set text(weight: 700)
  show outline.entry.where(level: 3): set text(style: "italic")
  page(
    numbering: none,
    outline(title: "Table of Contents", indent: 1.2em)
  )

  counter(page).update(1)
  [#metadata(none) <body-start>]
  doc
}
