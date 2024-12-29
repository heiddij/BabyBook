const router = require('express').Router()
const uploadConfig = require('../util/uploadConfig')
const multer = require('multer')
const upload = multer(uploadConfig)
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

const tokenExtractor = require('../middlewares/tokenExtractor')
const babyFinder = require('../middlewares/babyFinder')
const { Post, User } = require('../models')

router.get('/', async (req, res) => {
  try {
      const posts = await Post.findAll()
      res.json(posts)
  } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Server error" })
  }
})

router.post("/:id", upload.single("image"), tokenExtractor, babyFinder, async (req, res) => {
    try {
      const user = await User.findByPk(req.decodedToken.id)
      const baby = req.baby
      let imageUrl = null
  
      if (!user) {
        return response.status(400).json({ error: 'token missing or invalid' })
      }
  
      if (req.file) {
        const form = new FormData()
  
        form.append('key', process.env.IMGBB_API_KEY)
        form.append('image', req.file.buffer.toString("base64"))
  
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

module.exports = router