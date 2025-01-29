const router = require('express').Router()
const uploadConfig = require('../util/uploadConfig')
const multer = require('multer')
const upload = multer(uploadConfig)
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

const tokenExtractor = require('../middlewares/tokenExtractor')
const babyFinder = require('../middlewares/babyFinder')
const { Post, User, Baby } = require('../models')
const { likePost, unlikePost } = require('../controllers/likes')

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll()
    res.json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [
        { model: Baby,
          include: [
            { model: Post,
              include: [
                { model: User, as: 'likers' }
              ]
             }
          ]
        }
      ]
    })

    const userPosts = user.babies.flatMap(baby => baby.posts.map(post => post))

    res.status(200).json(userPosts)
  } catch (e) {
    console.error('Error getting user posts:', e.message || e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/user/following', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id, {
      include: [
        { 
          model: User, as: 'following', 
          attributes: ['id', 'username'],
          include: [
            {
              model: Baby, 
              attributes: ['id', 'firstname', 'profilepic'], 
              include: [
                { 
                  model: Post, 
                  attributes: ['id', 'post', 'image', 'createdAt'],
                  include: [
                    { model: User, as: 'likers' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    })

    const followedUsersBabiesPosts = user.following.flatMap(followedUser => 
      followedUser.babies.flatMap(baby => 
        baby.posts.map(post => ({
          id: post.id,
          post: post.post,
          image: post.image,
          createdAt: post.createdAt,
          likers: post.likers,
          baby: {
            id: baby.id,
            firstname: baby.firstname,
            profilepic: baby.profilepic,
          },
          followingUser: {
            id: followedUser.id,
            username: followedUser.username,
          }
        }))
      )
    )

    res.status(200).json(followedUsersBabiesPosts)
  } catch (e) {
    console.error('Error:', e.message || e)
    res.status(500).json({ error: 'Server error' })
  }
})


router.post('/:id', upload.single('image'), tokenExtractor, babyFinder, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const baby = req.baby
    let imageUrl = null
  
    if (!user) {
      return res.status(400).json({ error: 'Token puuttuu tai on virheellinen' })
    }
  
    if (req.file) {
      const form = new FormData()
  
      form.append('key', process.env.IMGBB_API_KEY)
      form.append('image', req.file.buffer.toString('base64'))
  
      const response = await axios.post(
        'https://api.imgbb.com/1/upload',
        form,
        {
          headers: {
            ...form.getHeaders(), 
          },
        }
      )
  
      imageUrl = response.data.data.url
    }
  
    const post = await Post.create({
      ...req.body,
      babyId: baby.id,
      image: imageUrl,
    })
  
    res.json(post)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/:id/like', tokenExtractor, likePost)
router.delete('/:id/unlike', tokenExtractor, unlikePost)

module.exports = router