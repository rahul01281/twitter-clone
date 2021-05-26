//handling the post textarea and submit button
$('#postTextarea').keyup((e) => {
  var textbox = $(e.target)
  var value = textbox.val().trim() //getting entered text in textbox

  var submitButton = $('#submitPostButton')

  if (submitButton.length === 0) return alert('no submit button found')

  if (value == '') {
    submitButton.prop('disabled', true) //if there is nothing in textarea, then set button to diabled
    return
  }

  submitButton.prop('disabled', false)
})

$('#submitPostButton').click((e) => {
  var button = $(e.target)
  var textbox = $('#postTextarea')

  var data = {
    content: textbox.val(),
  }

  $.post('/api/posts', data, (postData, status, xhr) => {
    //the function which is called when the request to the url has returned
    var html = createPostHtml(postData)
    $('.postsContainer').prepend(html) //display the post
    textbox.val('')
    button.prop('disabled', true)
  })
})

function createPostHtml(postData) {
  var postedBy = postData.postedBy

  return `<div class='post'>
            <div class='mainContentContainer'>
                <div class='userImageContainer'>
                    <img src='${postedBy.profilePic}'>
                </div>
                <div class='postContentContainer'>
                    <div class='header'>
                    
                    </div>
                    <div class='postBody'>
                        <span>${postData.content}</span>
                    </div>
                    <div class='postFooter'>
                    
                    </div>
                </div>
            </div>
          </div>`
}
