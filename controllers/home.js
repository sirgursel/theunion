import ButterCMS from 'buttercms';

// Initialize ButterCMS with your API token
const butter = ButterCMS(process.env.BUTTER_TOKEN);
import moment from 'moment';
import _ from 'lodash';

/**
 * GET /
 * Home page
 */
export const index = (req, res) => {
    res.locals._ = _;

    //set page title
    res.locals.title = "Home";

    //check auth status
    if (req.user)
        res.locals.loggedIn = true;

    //pass moment library to front end
    res.locals.moment = moment;

    //get page data from CMS
    let dateFilter = new Date();
    dateFilter = Date.now();
    console.log("dateFilter: "+dateFilter);
    // dateFilter.setDate(dateFilter.getDate() + 1)
    butter.content.retrieve(["events", "testimonials", "members", "articles"]).then(function(resp) {
        const events = _.filter(resp.data.data.events, (i) => new Date(i.starttime) > dateFilter);

        var payload = {
            events: _.slice(events,0,3),
            testimonials: resp.data.data.testimonials,
            members: resp.data.data.members,
            articles: resp.data.data.articles
        };

         //render the home page
        res.render('home', payload);

    }).catch(function (resp) {
        //add error logging
    });
};

/**
 * GET /
 * About page
 */
export const about = (req, res) => {

    // pass lodash
    res.locals._ = _;

    //set page title
    res.locals.title = 'About';

    //get page data from CMS
    butter.content.retrieve(["testimonials", "members"]).then(function(resp) {
        res.locals.testimonials = resp.data.data.testimonials;
        res.locals.members = resp.data.data.members;

        //render the page
        res.render('pages/about');
    }).catch(function (resp) {
        //add error logging
    });
};

/**
 * GET /
 * FAQ page
 */
export const faq = (req, res) => {

    //set page title
    res.locals.title = "FAQ";

    //get questions
    butter.content.retrieve(["faqs"]).then(function(resp) {
        res.locals.questions = resp.data.data.faqs;

        //render the page
        res.render('pages/faq')
    }).catch(function (resp) {
        //add error logging
    });
};

/**
 * GET /
 * Amenities page
 */
export const amenities = (req, res) => {
    //set page title
    res.locals.title = 'Amenities';

    //get amenity data
    butter.content.retrieve(["amenities", "testimonials"]).then(function(resp) {
        const amenities = _.map(resp.data.data.amenities, (v) => {
            v.images = _.map(v.images, (m) => {
                m.image = `https://cdn.filestackcontent.com/resize=width:500/${_.last(_.split(m.image, '/'))}`;

                return m;
            })

            return v;
        })

        res.locals.amenities = amenities;
        res.locals.testimonials = resp.data.data.testimonials;

        //render the page
        res.render('pages/amenities');
    }).catch(function (resp) {
        //add error logging
    });
};

/**
 * GET /
 * Gallery page
 */
export const gallery = (req, res) => {
    //set pagination flag
    res.locals.paginate = false;

    //set page title
    res.locals.title = 'Gallery';

    //get image data
    butter.content.retrieve(["gallery"]).then(function(resp) {
        const images = _.map(resp.data.data.gallery, (v, i) => {
            let w = 500, h = 300;

            if((i+1) % 3  === 1){
                w = 1100;
            }

            v.src = `https://cdn.filestackcontent.com/resize=width:${w},height:${h},fit:crop/${_.last(_.split(v.src, '/'))}`

            return v;
        })
        res.locals.images = images;

        

        //render page
        res.render('pages/gallery');
    }).catch(function (resp) {
        //add error logging
        console.log(resp);
    });
};

/**
 * GET /
 * Pricing page
 */
export const pricing = (req, res) => {

    //set page title
    res.locals.title = 'Pricing';

    //get page data
    butter.content.retrieve(["amenities", "testimonials"]).then(function(resp) {
        res.locals.amenities = resp.data.data.amenities;
        res.locals.testimonials = resp.data.data.testimonials;

        //render the page
        res.render('pages/pricing');

    }).catch(function (resp) {
        //add error logging
    });
};

/**
 * GET /
 * Pricing page
 */
export const events = (req, res) => {
    // pass moment
    res.locals.moment = moment;

    //set page title
    res.locals.title = 'Events';

    //get event data
    butter.content.retrieve(["events"]).then(function(resp) {
        const events = _.filter(resp.data.data.events, (i) => new Date(i.starttime) > new Date());

        res.locals.events = _.slice(events, 0, 5);

        //set pagination
        res.locals.paginate = false;

        res.render('pages/events');

    }).catch(function (resp) {
        //add error logging
    });
};

/**
 * GET /
 * Tithing  page
 */
export const tithe = (req, res) => {

    res.locals.title = 'Pay Your Tech Tithes';

    res.render('pages/tithe');
};

/**
 * GET /
 * Privacy Policy page
 */
export const privacy = (req, res) => {

    res.locals.title = 'Privacy Policies';

    res.render('pages/privacy');
};

/**
 * GET /
 * Terms of Service
 */
export const terms = (req, res) => {

    res.locals.title = 'Terms of Service';

    res.render('pages/terms');
};

// Group and export functions as default
const homeController = {
    index,
    about,
    faq,
    amenities,
    gallery,
    pricing,
    events,
    tithe,
    privacy,
    terms
    // Add other exported functions here...
};
export default homeController;  