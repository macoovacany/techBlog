const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


// techBlog/blog/:id
router.get('/:id', withAuth, async (req, res) => {

  const blogID = req.params.id;
  try {
    // grab the blog data 
    const blogData = await Blog.findByPk(blogID, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    
    const commentsData = await Comment.findAll(
      {
        where: {
          blog_id: blogID
        },
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
        
      }
      );
      
      const blog = {...blogData.get({ plain: true }),
      comments: commentsData.map(c => c.get({ plain: true }))
    };

    res.render('blog', {
      blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No Blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
