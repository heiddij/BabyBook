const router = require('express').Router()
const uploadConfig = require('../util/uploadConfig')
const multer = require('multer')
const upload = multer(uploadConfig)
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

const tokenExtractor = require('../middlewares/tokenExtractor')
const babyFinder = require('../middlewares/babyFinder')
const { Baby, User } = require('../models')

router.get('/', async (req, res) => {
  try {
      const babies = await Baby.findAll()
      res.json(babies)
  } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Server error" })
  }
})

router.get('/:id', babyFinder, async (req, res) => {
if (req.baby) {
    res.json(req.baby)
} else {
    res.status(404).end()
}
})

router.post("/", upload.single("profilepic"), tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
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

    const baby = await Baby.create({
      ...req.body,
      userId: user.id,
      profilepic: imageUrl,
    })

    res.json(baby)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', babyFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const baby = req.baby

  if (baby.userId !== user.id) {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  if (baby) {
      await baby.destroy()
  }
  res.status(204).end()
})


router.put('/:id', upload.single('profilepic'), babyFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const baby = req.baby

  if (baby.userId !== user.id) {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  try {
      if (baby) {
          const { firstname, lastname, birthdate, birthplace } = req.body
          let imageUrl = baby.profilepic

          if (req.file) {
              const form = new FormData()
              form.append('key', process.env.IMGBB_API_KEY)
              form.append('image', req.file.buffer.toString("base64"))

              const response = await axios.post('https://api.imgbb.com/1/upload', form, {
                  headers: {
                      ...form.getHeaders(),
                  },
              })

              imageUrl = response.data.data.url
          }

          baby.firstname = firstname
          baby.lastname = lastname
          baby.birthdate = birthdate
          baby.birthplace = birthplace
          baby.profilepic = imageUrl

          await baby.save() 

          res.json(baby)
      } else {
          res.status(404).end()
      }
  } catch (error) {
      console.error('Error updating baby:', error)
      res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router