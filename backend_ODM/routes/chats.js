var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');
const { Response } = require('../helpers/util');
const User = require('../models/user');


router.get('/', async function (req, res, next) {
  try {
    const getUser = await User.findById(req.query?.user)
    const getChat = await Chat.find({ $or: [{ sender: getUser?._id }, { receiver: getUser?._id }] })
    res.status(200).json(new Response(getChat))
  } catch (error) {
    console.log(error);
    res.status(500).json(new Response(error, false))
  }
});

router.post('/', async function (req, res, next) {
  try {
    const findUser = await User.findById(req.body.sender)
    const createChat = await Chat.create(req.body)
    findUser.chats.push(createChat._id)
    await findUser.save()
    res.status(201).json(new Response(createChat))
  } catch (error) {
    console.log(error);
    res.status(500).json(new Response(error, false))
  }
});

router.delete('/:_id', async function (req, res, next) {
  try {
    const deleteChat = await Chat.updateOne(
      {_id :req.params._id},
      {$set: {message: 'This message has been deleted'}}
      )
    res.status(200).json(new Response(deleteChat))
  } catch (error) {
    console.log(error);
    res.status(500).json(new Response(error, false))
  }
});

router.put('/:_id', async function (req, res, next) {
  try {
    const { updateReadStatus } = req.body
    const updateChat = await Chat.updateOne(
      { _id: req.params._id },
      { $set: { readstatus: updateReadStatus } }
    )
    res.status(200).json(new Response(updateChat))
  } catch (error) {
    console.log(error);
    res.status(500).json(new Response(error, false))
  }
});

module.exports = router;
