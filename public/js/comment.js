const addCommentFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form

const payload = {
  content: document.querySelector('#comment').value.trim(),
  blog_id: window.location.href.match(/.*blog\/([0-9]*)/)[1]
}
  if (comment) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/comment/', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.reload();
    } else {
      document.location.reload();
      console.log(response);
    }
  }
};


document
  .querySelector('.add-comment-form')
  .addEventListener('submit', addCommentFormHandler);

