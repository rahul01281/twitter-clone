$('#postTextarea').keyup((e) => {
  var textbox = $(e.target)
  var value = textbox.val().trim() //getting entered text in textbox
  console.log(value)
})
