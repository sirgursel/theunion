import nodemailer from 'nodemailer';
import Mailchimp from 'mailchimp-api-v3';
const mailchimp = new Mailchimp(process.env.MAILCHIMP_KEY);

/**
 * GET /contact
 * Contact form page.
 */
export const getContact = (req, res) => {
  const unknownUser = !(req.user);
  res.locals.title = 'Contact Us';
  res.locals.unknownUser = unknownUser;
  res.render('pages/contact');
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
export const postContact = (req, res) => {
  let fromName;
  let fromEmail;
  if (!req.user) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
  }
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  if (!req.user) {
    fromName = req.body.name;
    fromEmail = req.body.email;
  } else {
    fromName = req.user.profile.name || '';
    fromEmail = req.user.email;
  }
/**
 * Mailgun add-on usage.
 */
  let transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: process.env.MAILGUN_SMTP_LOGIN,
      pass: process.env.MAILGUN_SMTP_PASSWORD
    }
  });
  // Where the email will go from our form
  const mailOptions = {
    to: 'contact@theunion.io',
    from: `${fromName} <${fromEmail}>`,
    subject: 'Contact Form | The Union Website',
    text: req.body.message
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      req.flash('success', { msg: 'Email has been sent successfully!' });
      res.redirect('/contact');
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
        return transporter.sendMail(mailOptions);
      }
      console.log('ERROR: Could not send contact email after security downgrade.\n', err);
      req.flash('errors', { msg: 'Error sending the message. Please try again shortly.' });
      return false;
    })
    .then((result) => {
      if (result) {
        req.flash('success', { msg: 'Email has been sent successfully!' });
        return res.redirect('/contact');
      }
    })
    .catch((err) => {
      console.log('ERROR: Could not send contact email.\n', err);
      req.flash('errors', { msg: 'Error sending the message. Please try again shortly.' });
      return res.redirect('/contact');
    });
};

/**
 * POST /newsletter
 * Subcribe to the newsletter via the PACE mailchimp widget.
 */
export const newsletter = (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  let email = req.body.email;
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();

  const errors = req.validationErrors();
  console.log(JSON.stringify(errors, null, 2));

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }
  // setup mailchips tags
  let listID = "f207bf32d4";
  let tags = ["src: Website Signup"];
  let mcPath = "/lists/"+listID+"/members/";
  let mcBody = {
      "email_address": email,
      "status": "pending",
      "merge_fields": {},
      "tags": tags
  }
  //post to mailchimp endpoint
  mailchimp.post({
    path : mcPath,
    body: mcBody
  })
  .then(function (result) {
    //return to homepage with a success message
    //console.log("Good: "+JSON.stringify(result, null, 2));

    req.flash('success', "Your email has been added to our mailing list. Please confirm via the email we sent you.");
    return res.redirect('/');
  })
  .catch(function (err) {
    //return to homepage with a error message
    //console.log("Bad: "+JSON.stringify(err, null, 2));
    req.flash('error', "Your email has not been added to our mailing list.");
    return res.redirect('/');
  })
};

// Group and export functions as default
const contactController = {
  getContact,
  postContact,
  newsletter
};
export default contactController;