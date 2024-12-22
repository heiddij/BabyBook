const router = require('express').Router()
const jwt = require('jsonwebtoken')
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

const { SECRET } = require('../util/config')
const { Baby, User } = require('../models')

const babyFinder = async (req, res, next) => {
    req.baby = await Baby.findByPk(req.params.id)
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        console.log(authorization.substring(7))
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      } catch (error){
        console.log(error)
        return res.status(401).json({ error: 'token invalid' })
      }
    } else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
}

router.get('/', async (req, res) => {
  try {
      const babies = await Baby.findAll()
      /* const babiesWithProfilePic = babies.map((baby) => {
          // Convert BLOB to base64 if profilepic exists
          let profilepicBase64 = null
          if (baby.profilepic) {
              // Convert the BLOB data to base64 and prepend the MIME type
              profilepicBase64 = `data:image/jpeg;base64,${baby.profilepic.toString("base64")}`
          }
          return {
              ...baby.toJSON(),
              profilepic: profilepicBase64,
          };
      }); */
      res.json(babies)
  } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Server error" })
  }
});

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

    if (req.file) {
      const form = new FormData()

      form.append('key', process.env.IMGBB_API_KEY)
      form.append('image', fs.createReadStream(req.file.path))

      const response = await axios.post(
        'https://api.imgbb.com/1/upload',
        form,
        {
          headers: {
            ...form.getHeaders(), 
          },
        }
      );

      imageUrl = response.data.data.url;
    }

    const baby = await Baby.create({
      ...req.body,
      userId: user.id,
      profilepic: imageUrl,
    });

    res.json(baby);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', babyFinder, async (req, res) => {
if (req.baby) {
    await req.baby.destroy()
}
res.status(204).end()
})


router.put('/:id', babyFinder, async (req, res) => {
if (req.baby) {
    req.baby.firstname = req.body.firstname
    await req.baby.save()
    res.json(req.baby)
} else {
    res.status(404).end()
}
})

module.exports = router