const router = require('express').Router();
const { Blog } = require('../models');
const withAuth = require('../utils/auth');


// router.get('/:id', withAuth, async (req, res) => {
//   router.get('/:id',  async (req, res) => {
//     try {
//     const blogData = await Blog.findByPk(res.params.id);

//     // Serialize data so the template can read it
//     const blog = blogData.get({ plain: true });

//     // Pass serialized data and session flag into template
//     res.render('homepage', { 
//       blog, 
//       logged_in: req.session.logged_in 
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }

// });


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
