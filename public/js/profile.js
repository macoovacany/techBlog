const handleBlogForm = async (event) => {
  event.preventDefault();

  // data from form
  const blogName = document.querySelector('#blog-name').value.trim()
  const blogContent = document.querySelector('#blog-content').value.trim();
  const blogID = "";

  if (blogName && blogContent) {
    // send to the back end
    const payload = {
      name: blogName,
      content: blogContent,
    }
    const response = await fetch('/api/blogs/', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    // check if OK.
    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

const delButtonHandler = async (event) => {
  event.preventDefault();

  try {
    if (event.target.hasAttribute('data-id')) {

      const id = event.target.getAttribute('data-id');
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to delete blog');
        document.location.replace('/profile');
      }
    }
  }
  catch (err) {
    console.log(err);
  }
};

document
  .querySelector('.blog-form')
  .addEventListener('submit', handleBlogForm);

if (document.querySelector('.delete-blog')) {
  document
    .querySelector('.delete-blog')
    .addEventListener('click', delButtonHandler);
};

