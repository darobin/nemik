
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
  set page(paper: "a4")
  set text(
    font: "Mulish",
    size: 11pt,
    weight: 300,
  )
  set par(
    justify: true,
  )
  show heading: set text(font: "Cormorant")
  show heading.where(level: 1): set text(
    weight: 300,
    size: 48pt,
  )
  show heading.where(level: 1): set block(
    below: 5em,
  )
  show heading.where(level: 2): set text(
    weight: 600,
    size: 22pt,
  )
  // show heading.where(level: 2): set block(
  //   below: 0pt,
  // )

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

  doc
}



/*

a {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-decoration-color: var(--highlight);
  transition: text-decoration-thickness .2s;
}
hr::after {
  display: block;
  text-align: center;
  width: 100%;
  height: 50px;
  background: var(--highlight, #000);
  content: "";
  mask: url(../img/asterism.png);
  mask-position: center;
  mask-repeat: no-repeat;
}
dt {
  font-weight: bold;
}

/* Print */
@page {
  /* maybe move this to be with the text */
  @top-left {
    background-image: url(../img/asterism.png);
    background-size: contain;
    background-position: top;
    background-repeat: no-repeat;
    content: '';
    height: 1cm;
    width: 0.5cm;
    opacity: 0.4;
  }
  @top-right {
    content: string(heading);
    font-size: 9pt;
    font-family: var(--logo-fam);
    height: 1cm;
    vertical-align: top;
    width: 100%;
  }
  @bottom-right {
    content: counter(page);
    height: 1cm;
    text-align: center;
    width: 1cm;
    font-family: var(--logo-fam);
  }
}
@page :first {
  /* background-image: var(--cover); */
  /* background-image: url(../../ernst-haeckel.png); */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  margin: 0;
}
@page :blank, @page nothing {
  @top-left { background: none; content: '' }
  @top-right { content: none }
  @bottom-right { content: none }
}
@page no-chapter {
  @top-left { background: none; content: none }
  @top-right { content: none }
}
@media print {
  h1 {
    string-set: heading content();
    page: no-chapter;
  }
  h2 {
    font-family: var(--logo-fam);
    font-weight: 300;
    font-size: 18pt;
    margin-bottom: 0;
    line-height: 1.1;
  }
  section:first-of-type h2 {
    margin-top: 0;
  }
  /* NOTE: this only does two levels */
  section > h1 ~ p:last-child::after,
  section > h1 ~ section:last-child > p:last-child::after {
    content: "∎";
  }
  main > section:not(.special-section) {
    columns: 2;
    column-gap: 0.8cm;
    column-fill: auto;
  }
  a {
    text-decoration-thickness: 1px;
    text-decoration-color: #000;
  }
  a[role="doc-noteref"] {
    text-decoration: none;
  }
  ul {
    padding-left: 16pt;
  }
}
*/
