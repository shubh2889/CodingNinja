const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/user_controller');

router.get('/profile/:id', passport.checkAuthentication , usersController.profile);

router.post('/update/:id', passport.checkAuthentication , usersController.update);

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.get('/forgot-password', usersController.forgotPassword);
router.post('/reset-password', usersController.resetPassword);

router.post('/create', usersController.create);

// use passport as a middlewhere to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    { failureRedirect: '/users/sign-in'}
) ,usersController.createSession);

router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);


router.get('/reset-password/:id', usersController.resetPasswordPage);
router.post('/reset-password/:id', usersController.updatePassword);
module.exports = router ;