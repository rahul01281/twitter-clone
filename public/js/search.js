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
      search(value, searchType)
    }
  }, 1000) //starts a timer and executes the code one timme after a certain duration
})

function search(searchTerm, searchType) {
  var url = searchType == 'users' ? '/api/users' : '/api/posts'

  $.get(url, { search: searchTerm }, (data, status, xhr) => {
    console.log(data)
  })
}
