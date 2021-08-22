const router = require('express').Router();
const { Blog , User, Comment } = require('../models');
const withAuth = require('../utils/auth');

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
  try {
    // Find the logged in user based on the session ID

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

    blogform = {
      id: '',
      action:'add',
      title:' Create a New blog:',
      buttonText: 'Create',
      name:'',
      content: ''

    }

    res.render('profile', {
      user,
      blogs,
      blogform,
      logged_in: true
    });
  } catch (err) {
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
