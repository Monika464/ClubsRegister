const express = require('express')
const Manager = require('../models/manager')
const authClub = require('../middleware/authClub')
const authManager = require('../middleware/authManager')
const router = new express.Router()
const crypto = require('crypto')
const { sendEmail } = require('../emails/account')
//router.post("/managers", authClub, async (req, res) => {

router.post('/managers', async (req, res) => {
  //const user = new User(req.body);
  //console.log("req manager", req);
  const manager = new Manager(req.body)
  //console.log("hello tu manager", manager);

  try {
    await manager.save()
    // const token = await manager.generateAuthToken();
    //res.status(201).send({ manager, token });
    console.log('manager created')
    res.status(201).send({ manager })
    //res.status(201).send({ user });
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.post('/managers/login', async (req, res) => {
  try {
    const manager = await Manager.findByCredentials(
      req.body.email,
      req.body.password,
    )
    const token = await manager.generateAuthToken()
    res.send({ manager, token, redirectTo: '/managerpanel' })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.get('/managers/me', authManager, async (req, res) => {
  try {
    //const clubs = await Club.find({});
    //console.log("me tutaj", req.club);
    res.send(req.manager)
  } catch {
    res.status(500).send({ error: e.message })
  }
})

router.post('/managers/logout', authManager, async (req, res) => {
  try {
    req.manager.tokens = req.manager.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.manager.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.delete('/managers/me', authManager, async (req, res) => {
  try {
    // await req.club.remove();
    //sendCancelationEmail(req.user.email, req.user.name);

    await Manager.deleteOne({ _id: req.manager._id })
    res.send(req.manager)
    //console.log("club", req.club);
  } catch (e) {
    res.status(500).send()
  }
})

///PASSWORD RECOVERY
//Password reset
router.get('/managerss/reset-password/:token', (req, res) => {
  res.render('managerresetpassword.hbs', { token: req.params.token }) // Przekazanie tokenu do widoku (opcjonalne)
})

router.post('/managerss/reset-password/:token', async (req, res) => {
  try {
    const manager = await Manager.findOne({
      resetToken: req.params.token,
      tokenExpiry: { $gt: Date.now() },
    })

    if (!manager) {
      return res.status(400).send({ error: 'Token incorrect or expired' })
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).send({ error: 'Passwords not match' })
    }

    manager.password = req.body.newPassword
    manager.resetToken = undefined // Usuń token po użyciu
    manager.tokenExpiry = undefined
    await manager.save()
    res.render('email/passwordchanged')
    // res.status(200).send({ message: "Hasło changed" });
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/managerss/forgot-password', (req, res) => {
  res.render('managerforgotpassword') // formularz HTML
})

router.post('/managerss/forgot-password', async (req, res) => {
  try {
    console.log('req', req.body.email)
    const manager = await Manager.findOne({ email: req.body.email })
    if (!manager) {
      return res.status(404).send({ error: 'User does not exists' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    //console.log("czy jest token", token);
    manager.resetToken = token // Zapisz token w bazie
    //console.log("token w bazie", user.resetToken);
    manager.tokenExpiry = Date.now() + 3600000 // Ważność tokenu: 1 godzina
    //console.log("co w user", user);
    await manager.save()

    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/managerss/reset-password/${token}`
    // console.log("url przed wysłaniem", resetUrl);
    sendEmail(manager.email, 'Password reset', `Click this link: ${resetUrl}`)
    res.render('email/emailsent', { email: manager.email })
    //res.status(200).send({ message: "E-mail resetu wysłany" });
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

module.exports = router
