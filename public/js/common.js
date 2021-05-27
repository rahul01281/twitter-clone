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

//this will not work because the buttons are dynamic content and when this executes we don't have our buttons
// $('.likeButton').click((e) => {
//   console.log('button clicked')
// })

//what it does is attach the click event to the document itself so now the whole page will listen for clicks on the ".likeButton" element and then execute it
$(document).on('click', '.likeButton', (e) => {
  var button = $(e.target)
  var postId = getPostIdFromElement(button)

  if (postId === undefined) return

  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: 'PUT',
    success: (postData) => {
      button.find('span').text(postData.likes.length || '')

      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass('active')
      } else {
        button.removeClass('active')
      }
    },
  })
})

function getPostIdFromElement(element) {
  var isRoot = element.hasClass('post')
  var rootElement = isRoot ? element : element.closest('.post')
  var postId = rootElement.data().id

  if (postId === undefined) {
    return alert('post id undefined')
  }
  return postId
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000
  var msPerHour = msPerMinute * 60
  var msPerDay = msPerHour * 24
  var msPerMonth = msPerDay * 30
  var msPerYear = msPerDay * 365

  var elapsed = current - previous

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) {
      return 'Just now'
    }
    return Math.round(elapsed / 1000) + ' seconds ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago'
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago'
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago'
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago'
  }
}

function createPostHtml(postData) {
  var postedBy = postData.postedBy

  if (postedBy._id === undefined) {
    return console.log('user object not populated')
  }

  var displayName = postedBy.firstName + ' ' + postedBy.lastName
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt))

  var likedButtonActiveClass = postData.likes.includes(userLoggedIn._id)
    ? 'active'
    : ''

  return `<div class='post' data-id='${postData._id}'>
            <div class='mainContentContainer'>
                <div class='userImageContainer'>
                    <img src='${postedBy.profilePic}'>
                </div>
                <div class='postContentContainer'>
                    <div class='header'>
                        <a href='/profile/${
                          postedBy.username
                        }' class='displayName'>${displayName}</a>
                        <span class='username'>@${postedBy.username}</span>
                        <span class='date'>${timestamp}</span>
                    </div>
                    <div class='postBody'>
                        <span>${postData.content}</span>
                    </div>
                    <div class='postFooter'>
                        <div class='postButtonContainer'>
                            <button><i class='far fa-comment'></i></button>
                        </div>
                        <div class='postButtonContainer green'>
                            <button class='retweet'><i class='fas fa-retweet'></i></button>
                        </div>
                        <div class='postButtonContainer red'>
                            <button class='likeButton ${likedButtonActiveClass}'><i class='far fa-heart'></i><span>${
    postData.likes.length || ''
  }</span></button>
                        </div>
                    </div>
                </div>
            </div>
          </div>`
}
