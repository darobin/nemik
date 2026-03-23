
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
  )
  set par(
    justify: true,
  )
  show heading: set text(font: "Cormorant")

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

header, nav, main, footer {
  max-width: var(--page-width);
  margin: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
header {
  padding-top: 8rem;
  padding-bottom: 2rem;
}
main {
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.2;
}
a {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-decoration-color: var(--highlight);
  transition: text-decoration-thickness .2s;
}
a:hover {
  text-decoration-thickness: 5px;
}
strong {
  font-weight: bold;
}
hr {
  border: none;
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
.title, .subtitle, h1, h2, h3, h4, h5, h6 {
  font-family: var(--header-fam);
}
.title {
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}
.subtitle {
  font-size: 1.6rem;
  font-weight: 400;
  color: #222;
  margin: 0;
  line-height: 1;
}
:is(h1, h2, h3, h4, h5, h6) + p {
  margin-top: 0;
}
h1 {
  margin: 2rem 0 0 0;
  line-height: 1.2;
}
h2 {
  font-size: inherit;
}
.meta {
  font-size: 0.8rem;
  text-align: right;
}
.meta .sep {
  color: var(--highlight);
}
img.illustration {
  float: left;
  margin: 0 1rem 10px 0;
}
img, video {
  max-width: 100%;
}
.page {
  line-height: 1.3;
}
blockquote {
  clear: both;
  border-left: 0.5rem solid var(--highlight);
  margin-left: 0;
  padding-left: 1rem;
  font-style: italic;
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
  header {
    height: 297mm;
    position: relative;
    margin: 1cm 1cm 0 1cm;
    page: nothing;
  }
  header p {
    background: #fff;
    padding: 5mm;
    text-align: left;
    text-indent: 0;
  }
  header .subtitle {
    margin-top: 1rem;
    text-align: left;
    text-indent: 0;
  }
  header .meta {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-top: 4rem;
  }
  header .meta div {
    font-family: var(--header-fam);
    margin-top: 1rem;
    background: #fff;
    padding: 5mm;
    font-size: 1.6rem;
    font-weight: 400;
    color: #222;
    line-height: 1;
    width: fit-content;
  }
  .no-cover header .meta div {
    margin-top: 0;
    padding: 0 5mm;
  }
  header .imprimatur {
    background: #fff;
    position: absolute;
    bottom: 2cm;
    left: -1cm;
    right: -1cm;
    padding: 0.5cm 1cm;
    /* min-height: 4cm; */
  }
  header .imprimatur img {
    width: 1.4cm;
  }
  header .imprimatur div {
    font-size: 1.4rem;
  }
  h1 {
    break-before: always;
    string-set: heading content();
    page: no-chapter;
    font-family: var(--logo-fam);
    font-weight: 300;
    font-size: 48pt;
    margin-bottom: 5em;
    line-height: 1;
    column-span: all;
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
  .special-section h1 {
    margin-bottom: 1em;
  }
  #abstract {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 297mm;
    break-before: always;
    break-after: always;
    page: no-chapter;
    font-style: italic;
    font-size: 10pt;
  }
  #abstract:empty {
    display: none;
  }
  .no-abstract #abstract {
    justify-content: initial;
    font-style: normal;
  }
  p:not(:first-of-type):not(.subtitle) {
    text-indent: 2em;
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
