
const blogFormData = (options = {}) => {
  return {
    id: document.querySelector('.form').dataset.blogID,
    action: document.querySelector('.form').dataset.blogAction,
    name: document.querySelector('#blog-name').value.trim(),
    content: document.querySelector('#blog-content').value.trim(),
    ...options
  }
}

const handleBlogForm = async (event) => {
  event.preventDefault();

  try {
    const payload = blogFormData();

    if (payload.name && payload.content) {
      // send to the back end
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
  }
  catch (err) {
    console.log(err);
  }
};


const handleDelete = async (id) => {

  const response = await fetch(`/api/blogs/${id}`,
    {
      method: 'DELETE',
    });

  if (response.ok) {
    document.location.replace('/profile');
  } else {
    alert('Action failed');
    document.location.replace('/profile');
  }


}


const handleEdit = async (id) => {

  const response = await fetch('/profile',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'load', id: id }),
    }
  );
  if (response.ok) {
    document.location.replace('/profile');
  } else {
    alert('Action failed');
    document.location.replace('/profile');
  }


}


const handleBlogList = async (event) => {
  // skip through if going to blog
  if (event.target instanceof HTMLAnchorElement) {
    return
  }
  
  event.preventDefault();


  try {
    const id = event.target.getAttribute('data-id');
    const action = event.target.getAttribute('data-action');

    switch (action) {
      case 'edit':

        handleEdit(id)
        // tell the profile page to load the form with the id
        break;

      case 'delete':
        handleDelete(id)
        break;

      default:
        console.log('unknown action called in user blog list')
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
    .querySelector('.user-blog-list-form')
    .addEventListener('click', handleBlogList);
};
