import { promisify } from 'util';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import passport from 'passport';
import User from '../models/User.js';
import needle from 'needle';
import { toTitleCase } from '../utils/toTitleCase.js';
const randomBytesAsync = promisify(crypto.randomBytes);


/**
 * GET /login
 * Login page.
 */
export const getLogin = (req, res) => {
  if (req.user) {
    res.locals.loggedIn = true;
    req.flash("info", {msg: "You are already signed in"});
    req.flash("errors", {msg: "You should not see this message"});
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = (req, res) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();
  const email = req.body.email;
  const password = req.body.password;

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      // login user to cobot and get token
      needle('post', 'https://www.cobot.me/oauth/access_token?scope=write_charges&grant_type=password&username='+email+'&password='+password+'&client_id='+process.env.COBOT_CLIENT_ID+'&client_secret='+process.env.COBOT_CLIENT_SECRET, { }, { json: true })
      .then(function(response) {
        // do something with (response)
        // update user token
        if (response.body.error) {
          req.flash('info', { msg: 'Cobot token retrieval failed:'});
          console.log("Cobot Error: ", response.body.error_description);
        }
        else {
          let token = response.body.access_token;
          req.flash('success', { msg: 'Success! Cobot token: '+token+' retreived, check logs' });
          console.log("Get Token Response: ", response.body);
          user.tokens.push({ kind: 'cobot', token });
        }
      })
      .catch(function(err) {
        console.log('Error', err)
      });
      // indicate successful login and redirect
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
export const logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};

/**
 * GET /signup
 * Signup page.
 */
export const getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = (req, res) => {

  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    //Create user in cobot system
    needle('post', 
            'https://www.cobot.me/api/users',
            {
              "access_token": "27e4df3ea6151ce26c776c6661881081e372cc11be39d38a157263f9d5193c3f",
              "token_type": "bearer"
             }, 
             { json: true })
      .then(function(response) {
        // do something with (response)
        // update user token
        if (response.body.error) {
          req.flash('info', { msg: 'Cobot create user failed:'});
          console.log("Cobot Create User Error: ", response.body.error_description);
          console.log("Cobot Response Body: ", JSON.stringify(response.body, null, 2));
        }
        else {
          console.log("Cobot Response Body: ", JSON.stringify(response.body, null, 2));
          console.log("Copying code: ", req.query.code);
          let code = req.query.code;
          needle('post',
                 'https://members.theunion.io/oauth/access_token?&client_id='+process.env.COBOT_CLIENT_ID+'&client_secret='+process.env.COBOT_CLIENT_SECRET+'&grant_type='+code,
                 {
                  "access_token": "27e4df3ea6151ce26c776c6661881081e372cc11be39d38a157263f9d5193c3f",
                  "token_type": "bearer"
                 },
                 {json: true})
          .then(function(response) {
            // do something with (response)
            // update user token
            if (response.body.error) {
              req.flash('info', { msg: 'Cobot token retrieval failed:'});
              console.log("Cobot Error: ", response.body.error_description);
            }
            else {
              let token = response.body.access_token;
              req.flash('success', { msg: 'Success! Cobot token: '+token+' retreived, check logs' });
              console.log("Get Token Response: ", response.body);
              //Add cobot token to user obeject before saving to database
              user.tokens.push({ kind: 'cobot', token });
            }
          })
          .catch(function(err) {
            console.log('Error', err)
          });
        }
      })
      .catch(function(err) {
        console.log('Error', err)
      });
    //save user object to datbase
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
export const getAccount = (req, res) => {

  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
export const postUpdateProfile = (req, res) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
export const postUpdatePassword = (req, res) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
export const postDeleteAccount = (req, res) => {
  User.deleteOne({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export const getOauthUnlink = (req, res) => {

  const { provider } = req.params;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    const lowerCaseProvider = provider.toLowerCase();
    const titleCaseProvider = toTitleCase(provider);
    user[lowerCaseProvider] = undefined;
    const tokensWithoutProviderToUnlink = user.tokens.filter(token =>
      token.kind !== lowerCaseProvider);
    // Some auth providers do not provide an email address in the user profile.
    // As a result, we need to verify that unlinking the provider is safe by ensuring
    // that another login method exists.
    if (
      !(user.email && user.password)
      && tokensWithoutProviderToUnlink.length === 0
    ) {
      req.flash('errors', {
        msg: `The ${titleCaseProvider} account cannot be unlinked without another form of login enabled.`
          + ' Please link another account or add an email address and password.'
      });
      return res.redirect('/account');
    }
    user.tokens = tokensWithoutProviderToUnlink;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${titleCaseProvider} account has been unlinked.` });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
export const getReset = (req, res) => {

  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export const postReset = (req, res) => {

  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Your Union Member password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              req.flash('success', { msg: 'Success! Your password has been changed.' });
            });
        }
        console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
        req.flash('warning', { msg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.' });
        return err;
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch(err => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
export const getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export const postForgot = (req, res) => {

getForgot
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  const createRandomToken = randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    let transporter = nodemailer.createTransport({
      service: 'Mailgun',
      auth: {
        user: process.env.MAILGUN_SMTP_LOGIN,
        pass: process.env.MAILGUN_SMTP_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'contact@theunion.io',
      subject: 'Reset your password to access The Union Co-Working Space',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'Mailgun',
            auth: {
              user: process.env.MAILGUN_SMTP_LOGIN,
              pass: process.env.MAILGUN_SMTP_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
            });
        }
        console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
        req.flash('errors', { msg: 'Error sending the password reset message. Please try again shortly.' });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};

// Group and export functions as default
const userController = {
  getLogin,
  postLogin,
  logout,
  getSignup,
  postSignup,
  getAccount,
  postUpdateProfile,
  postUpdatePassword,
  postDeleteAccount,
  getOauthUnlink,
  getReset,
  postReset,
  getForgot,
  postForgot
};
export default userController;  