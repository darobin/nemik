

export default async function (nemik) {
  nemik
    .warn(`This seems to work.`)
    .gdoc('gdoc-rb', '1NM8_Ww-Q6ER4hLgyrAtTrGINQouc1j-CleeDiCTA6A4')
    .data('gdoc', (data) => console.warn(JSON.stringify(data, null, 2)))
  ;
}
