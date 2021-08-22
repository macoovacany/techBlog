const router = require('express').Router();
const withAuth = require('../utils/auth');

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const blogRoutes = require('./blogRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/blog', blogRoutes);



module.exports = router;
