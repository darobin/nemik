

export default async function (nemik) {
  nemik
    .warn(`This seems to work.`)
    .gdoc('gdoc-rb', '1bH_aP3oNTrbTrlSiZz9cEXMt2BFT0fBVx1FFSevGH9M', { save: 'book2.json' })
    // .data('gdoc', (data) => console.warn(JSON.stringify(data, null, 2)))
    .gdoc2html({ save: 'book2.html', pretty: true })
  ;
}
