const express = require('express');
const emojis = require('./emojis');
const monk = require('monk');
const Joi = require('@hapi/joi');


const db = monk(process.env.MONGO_URI);
const faqs = db.get('faqs');
const schema = Joi.object({
  pertanyaan: Joi.string().trim().required(),
  jawaban: Joi.string().trim().required(),
  video_url:Joi.string().uri(),
})
const router = express.Router();




// Melihat semua yang ada di database
router.get('/', async(req, res, next) => {
  try {
    const items = await faqs.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Disini kita kan membaca inputtan dengan  spesifik id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await faqs.findOne({
      _id : id,
    });
    if(!item) return next();
    return res.json(item);
  } catch (error) {
    next(error);
  }
});

// Disini kita kan mengupdate inputtan dengan id
router.post('/', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body);
    const inserted =  await faqs.insert(value);
    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

// Disini kita kan mengupdate inputtan dengan id
router.put('/:id', async(req, res, next) => {
  try {
    const { id } = req.params;
    const value = await schema.validateAsync(req.body);
    const item = await faqs.findOne({
      _id: id,
    });
    if(!item) return next();
    const updated = await faqs.update({
      _id: id,
    }, {
      $set:value,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Menghapus satu dengan id spesifik
router.delete('/:id', async(req, res, next) => {
  try {
    const { id }= req.params;
    await faqs.remove({ _id:id });
    res.json("Berhasil dihapus");
  } catch (error) {
    next(error);
    
  }
});

router.use('/emojis', emojis);

module.exports = router;
