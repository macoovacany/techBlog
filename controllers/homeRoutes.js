const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

const blogForm = (action, blogData) => {
  console.log(blogData)
  switch (action) {
    case 'edit':
      return {
        id: blogData.id,
        action: 'edit',
        title: ' Edit this  blog:',
        buttonText: 'Update',
        name: blogData.name,
        content: blogData.content
      }


    default:
      return {
        id: '',
        action: 'add',
        title: ' Create a New blog:',
        buttonText: 'Create',
        name: '',
        content: ''
      }
  }


}


router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {

  const userId = req.session.user_id;
  console.log(req.body);

  try {

    const userData = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    const blogData = await Blog.findAll({
      where: [
        {
          user_id: userId
        },
      ],
    });
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // what type or profile is going to be reloaded?
    switch (req.body.action) {
      case 'edit':
        blogform = blogForm('edit', blogs[req.body.blogId]);
        break

      case 'load':
        blogform = blogForm('load', blogs[req.body.blogId]);
        break

      default:
        blogform = blogForm('', {})  // default balnk values for new 'add new' blog form.
    }

    // console.log(blogform);

    res.render('profile', {
      user,
      blogs,
      blogform,
      logged_in: true
    });

  }  // end switch
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
