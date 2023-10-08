function main () {
  var data = decodeURIComponent(escape(atob('')))
  var iframe = document.getElementsByTagName('iframe')[0]
  var doc = iframe.contentWindow.document
  doc.open()
  doc.write(data)
  doc.close()
  var m = document.getElementsByTagName('main')[0]
  m.parentNode.removeChild(m)
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.removeChild(s)
}
main()
