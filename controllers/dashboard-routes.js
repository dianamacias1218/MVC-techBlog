const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
//     res.render('dashboard', { loggedIn: true });

    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_comment',
            'title',
            'createdAt'
        ],
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'createdAt'],
                include: {
                model: User,
                attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true }));
        
            res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/edit/:id', withAuth,(req, res)=>{
    Post.findOne({
        where: {
        id: req.params.id
        },
        attributes: [
            'id',
            'post_comment',
            'title',
            'createdAt'
            
         ] ,
        include: [
          {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'createdAt'],
              include: {
                model: User,
                attributes: ['username']
              }
          }, 
          {
              model: User,
              attributes: ['username']
          }
        ]
    })
    .then(dbPostData => {
    if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
    }
        // const posts = dbPostData.get({ plain: true });
        const posts = dbPostData.get({ plain: true });;
        // console.log(dbPostData);

        res.render('edit-post', {
        posts,
        loggedIn: true
        });
    })
    .catch(err => {
    console.log(err);
    res.status(500).json(err);
    });
});

module.exports = router;