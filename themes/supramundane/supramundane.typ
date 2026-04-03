
#import "@preview/hydra:0.6.2": hydra

#let article(
  cover: "",
  title: "",
  subtitle: "",
  author: "",
  date: "",
  dt: none,
  abstract: [],
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
      let matches = query(heading.where(level: 1))
      let current = counter(page).get()
      let has-h1 = matches.any(m =>
        counter(page).at(m.location()) == current
      )
      // this is getting the *second* h1 (because ToC generates one)
      let start-page = query(heading.where(level: 1)).at(1).location().page()
      let this-page = here().page()
      if this-page >= start-page and not has-h1 [
        #h(1fr)
        *#box(title)*: _#hydra(1)_
      ]
    },
    footer: context {
      // this was getting the *second* h1 (because ToC generates one)
      // let start-page = query(heading.where(level: 1)).at(1).location().page()
      let start-page = query(heading.where(level: 1)).first().location().page()
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
  // set heading(numbering: "1.")
  show heading: set text(font: "Cormorant")
  show heading.where(level: 1): set text(
    weight: 300,
    size: 48pt,
  )
  show heading.where(level: 1): set block(
    below: 5em,
  )
  show heading.where(level: 1, body: [Executive Summary]): set block(below: 1em)
  show heading.where(level: 1, body: [Acknowledgements]): set block(below: 1em)
  show heading.where(level: 1, body: [References]): set block(below: 1em)
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

  // COVER
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

  // ABSTRACT
  page(
    numbering: none,
    [
      #set text(
        style: "italic",
        size: 10pt
      )
      #abstract
    ]
  )
  // TOC
  show outline: set heading(level: 2)
  show outline.entry.where(level: 1): set text(weight: 700)
  show outline.entry.where(level: 3): set text(style: "italic")
  page(
    numbering: none,
    outline(title: "Table of Contents", indent: 1.2em)
  )

  counter(page).update(1)
  doc
}
