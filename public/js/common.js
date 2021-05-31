//Global Variables
var cropper

//handling the post textarea and submit button
$('#postTextarea, #replyTextarea').keyup((e) => {
  var textbox = $(e.target)
  var value = textbox.val().trim() //getting entered text in textbox

  var isModal = textbox.parents('.modal').length === 1

  var submitButton = isModal ? $('#submitReplyButton') : $('#submitPostButton')

  if (submitButton.length === 0) return alert('no submit button found')

  if (value == '') {
    submitButton.prop('disabled', true) //if there is nothing in textarea, then set button to diabled
    return
  }

  submitButton.prop('disabled', false)
})

$('#submitPostButton, #submitReplyButton').click((e) => {
  var button = $(e.target)

  var isModal = button.parents('.modal').length === 1
  var textbox = isModal ? $('#replyTextarea') : $('#postTextarea')

  var data = {
    content: textbox.val(),
  }

  if (isModal) {
    var id = button.data().id
    if (id === null) {
      return alert('button id is null')
    }

    data.replyTo = id
  }

  $.post('/api/posts', data, (postData, status, xhr) => {
    //the function which is called when the request to the url has returned

    if (postData.replyTo) {
      location.reload()
    } else {
      var html = createPostHtml(postData)
      $('.postsContainer').prepend(html) //display the post
      textbox.val('')
      button.prop('disabled', true)
    }
  })
})

$('#replyModal').on('show.bs.modal', (e) => {
  var button = $(e.relatedTarget)
  var postId = getPostIdFromElement(button)

  //set data-id of the button to postId
  $('#submitReplyButton').data('id', postId)
  // $('#submitReplyButton').attr("data-id", postId)

  $.get(`/api/posts/${postId}`, (post, status, xhr) => {
    outputPosts(post.postData, $('#originalPostContainer'))
  })
})

$('#deletePostModal').on('show.bs.modal', (e) => {
  var button = $(e.relatedTarget)
  var postId = getPostIdFromElement(button)

  //set data-id of the button to postId
  $('#deletePostButton').data('id', postId)
  // $('#submitReplyButton').attr("data-id", postId)
})

$('#deletePostButton').click((e) => {
  var postId = $(e.target).data('id')

  $.ajax({
    url: `/api/posts/${postId}`,
    type: 'DELETE',
    success: (data, status, xhr) => {
      if (xhr.status != 202) {
        return alert('could not delete')
      }
      location.reload()
    },
  })
})

$('#replyModal').on('hidden.bs.modal', (e) => {
  $('#originalPostContainer').html('')
})

// $('#filePhoto').change((e) => {
//   //fire when file photo is changes
//   var input = $(e.target)[0]

//   if (input.files && input.files[0]) {
//     var reader = new FileReader() //allows to read files
//     reader.onload = () => {
//       console.log('loaded')
//     }
//     reader.readAsDataURL(input.files[0])
//   }
// })

$('#filePhoto').change(function () {
  //fire when file photo is changes

  if (this.files && this.files[0]) {
    var reader = new FileReader() //allows to read files
    reader.onload = (e) => {
      //load the image into the container to display it
      var image = document.getElementById('imagePreview')

      image.src = e.target.result
      // $('#imagePreview').attr('src', e.target.result)

      if (cropper !== undefined) {
        cropper.destroy()
      }

      cropper = new Cropper(image, { aspectRatio: 1 / 1, background: false })
    }
    reader.readAsDataURL(this.files[0])
  }
})

$('#coverPhoto').change(function () {
  //fire when file photo is changes

  if (this.files && this.files[0]) {
    var reader = new FileReader() //allows to read files
    reader.onload = (e) => {
      //load the image into the container to display it
      var image = document.getElementById('coverPreview')

      image.src = e.target.result
      // $('#imagePreview').attr('src', e.target.result)

      if (cropper !== undefined) {
        cropper.destroy()
      }

      cropper = new Cropper(image, { aspectRatio: 16 / 9, background: false })
    }
    reader.readAsDataURL(this.files[0])
  }
})

$('#imageUploadButton').click(() => {
  var canvas = cropper.getCroppedCanvas()

  if (canvas == null) {
    alert('could not upload image. Make sure it is an image file')
    return
  }

  //Blob is used to store images and videos and quite useful in transferring this data to between services
  canvas.toBlob((blob) => {
    var formData = new FormData()
    formData.append('croppedImage', blob)

    $.ajax({
      url: '/api/users/profilePicture',
      type: 'POST',
      data: formData,
      processData: false, //forces jquery not to convert formData to a string
      contentType: false, //contentType is used for forms that are submitting files
      success: (data, status, xhr) => location.reload(),
    })
  })
})

$('#coverPhotoUploadButton').click(() => {
  var canvas = cropper.getCroppedCanvas()

  if (canvas == null) {
    alert('could not upload image. Make sure it is an image file')
    return
  }

  //Blob is used to store images and videos and quite useful in transferring this data to between services
  canvas.toBlob((blob) => {
    var formData = new FormData()
    formData.append('croppedImage', blob)

    $.ajax({
      url: '/api/users/coverPhoto',
      type: 'POST',
      data: formData,
      processData: false, //forces jquery not to convert formData to a string
      contentType: false, //contentType is used for forms that are submitting files
      success: (data, status, xhr) => location.reload(),
    })
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

$(document).on('click', '.retweetButton', (e) => {
  var button = $(e.target)
  var postId = getPostIdFromElement(button)

  if (postId === undefined) return

  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: 'POST',
    success: (postData) => {
      button.find('span').text(postData.retweetUsers.length || '')

      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass('active')
      } else {
        button.removeClass('active')
      }
    },
  })
})

$(document).on('click', '.post', (e) => {
  var element = $(e.target)
  var postId = getPostIdFromElement(element)

  if (postId !== undefined && !element.is('button')) {
    window.location.href = `/post/${postId}`
  }
})

$(document).on('click', '.followButton', (e) => {
  var button = $(e.target)
  var userId = button.data().user

  $.ajax({
    url: `/api/users/${userId}/follow`,
    type: 'PUT',
    success: (data, status, xhr) => {
      if (xhr.status == 404) {
        alert('user not found')
        return
      }

      var difference = 1
      if (data.following && data.following.includes(userId)) {
        button.addClass('following')
        button.text('Following')
      } else {
        button.removeClass('following')
        button.text('Follow')
        difference = -1
      }

      var followesLabel = $('#followersValue')
      if (followesLabel.length != 0) {
        var followersText = followesLabel.text()
        followersText = parseInt(followersText)
        followesLabel.text(followersText + difference)
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

function outputPosts(posts, container) {
  container.html('')

  if (!Array.isArray(posts)) {
    posts = [posts]
  }

  posts.forEach((post) => {
    var html = createPostHtml(post)
    container.append(html)
  })

  if (posts.length === 0) {
    container.append("<span class='noResults'>Nothing to show :(</span>")
  }
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

function createPostHtml(postData, largeFont = false) {
  if (postData === null) return alert('post object is null')

  var isRetweet = postData.retweetData !== undefined
  var retweetedBy = isRetweet ? postData.postedBy.username : null
  postData = isRetweet ? postData.retweetData : postData

  var postedBy = postData.postedBy

  if (postedBy._id === undefined) {
    return console.log('user object not populated')
  }

  var displayName = postedBy.firstName + ' ' + postedBy.lastName
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt))

  var likedButtonActiveClass = postData.likes.includes(userLoggedIn._id)
    ? 'active'
    : ''

  var retweetButtonActiveClass = postData.retweetUsers.includes(
    userLoggedIn._id
  )
    ? 'active'
    : ''

  var largeFontClass = largeFont ? 'largeFont' : ''

  var retweetText = ''
  if (isRetweet) {
    retweetText = `<span><i class='fas fa-retweet'></i>  Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a></span>`
  }

  var replyFlag = ''
  if (postData.replyTo && postData.replyTo._id) {
    if (!postData.replyTo._id) {
      return alert('reply to is not populated')
    } else if (!postData.replyTo.postedBy._id) {
      return alert('posted by is not populated')
    }

    var replyToUsername = postData.replyTo.postedBy.username
    replyFlag = `<div class='replyFlag'>
                  Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
                </div>`
  }

  var buttons = ''
  if (postData.postedBy._id === userLoggedIn._id) {
    buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>`
  }

  return `<div class='post ${largeFontClass}' data-id='${postData._id}'>
            <div class='postActionContainer'>
              ${retweetText}
            </div>
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
                        ${buttons}
                    </div>
                    ${replyFlag}
                    <div class='postBody'>
                        <span>${postData.content}</span>
                    </div>
                    <div class='postFooter'>
                        <div class='postButtonContainer'>
                            <button data-toggle='modal' data-target='#replyModal'><i class='far fa-comment'></i></button>
                        </div>
                        <div class='postButtonContainer green'>
                            <button class='retweetButton ${retweetButtonActiveClass}'><i class='fas fa-retweet'></i><span>${
    postData.retweetUsers.length || ''
  }</span></button>
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

function outputPostsWithReplies(posts, container) {
  container.html('')

  if (posts.replyTo !== undefined && posts.replyTo._id !== undefined) {
    var html = createPostHtml(posts.replyTo)
    container.append(html)
  }

  var mainPostHtml = createPostHtml(posts.postData, true)
  container.append(mainPostHtml)

  posts.replies.forEach((post) => {
    var html = createPostHtml(post)
    container.append(html)
  })
}
