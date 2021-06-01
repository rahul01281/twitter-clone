var timer

$('#searchBox').keydown((e) => {
  clearTimeout(timer)
  var textbox = $(event.target)
  var value = textbox.val()
  var searchType = textbox.data().search

  timer = setTimeout(() => {
    value = textbox.val().trim()

    if (value == '') {
      $('.resultsContainer').html('')
    } else {
      console.log(value, searchType)
    }
  }, 1000) //starts a timer and executes the code one timme after a certain duration
})
