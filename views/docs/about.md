## Example of res.locals for events.pug page:

### Dependenties
- <mark>res.locals._ = require('lodash')</mark>

```js
app.get('/about', (req, res, next) => {
    res.locals.members = [{
        name: 'Arif Gursel',
        description: 'Founder & GM',
        photo: 'img/headshot-arif@2x.png',
        background: 'img/hero-members@2x.png',
        links: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            facebook: 'https://facebook.com',
        },
        bio: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. \n Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. \n Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.',
        testimony: 'She is a GREAT MENTOR! Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.'
    },
    {
        name: 'Gusti Clark',
        description: 'Head of Operations',
        photo: 'img/headshot-gusti@2x.png',
        background: 'img/hero-members@2x.png',
        links: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            facebook: 'https://facebook.com',
        }
    },
    {
        name: 'My Tam Nguyen',
        description: 'Business Development',
        photo: 'img/headshot-mytam@2x.png',
        background: 'img/hero-members@2x.png',
        links: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            facebook: 'https://facebook.com',
        }
    },
    {
        name: 'Jolyn Gardner',
        description: 'Arts Curator',
        photo: 'img/headshot-jolyn@2x.png',
        background: 'img/hero-members@2x.png',
        links: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            facebook: 'https://facebook.com',
        }
    },
    {
        name: 'My Tam Nguyen',
        description: 'Business Development',
        photo: 'img/headshot-mytam@2x.png',
        background: 'img/hero-members@2x.png',
        links: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            facebook: 'https://facebook.com',
        }
    },
    {
        name: 'My Tam Nguyen',
        description: 'Business Development',
        photo: 'img/headshot-mytam@2x.png',
        background: 'img/hero-members@2x.png',
        links: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            facebook: 'https://facebook.com',
        }
    }]

    res.locals.testimonials = [{
        thumbnail: '/img/testimonial-logo@2x.png',
        content: '"The Union offered an inspiring, collaborative and welcoming environment with business resources to guide people toward success. The co-working space and workshops are critical to powering entrepreneurs."',
        author: {
            name: 'David Harris',
            position: 'Startup Advocate, City of Seattle'
        }
    },
    {
        thumbnail: '/img/testimonial-logo@2x.png',
        content: '"The Union offered an inspiring, collaborative and welcoming environment with business resources to guide people toward success. The co-working space and workshops are critical to powering entrepreneurs."',
        author: {
            name: 'David Harris',
            position: 'Startup Advocate, City of Seattle'
        }
    },
    {
        thumbnail: '/img/testimonial-logo@2x.png',
        content: '"The Union offered an inspiring, collaborative and welcoming environment with business resources to guide people toward success. The co-working space and workshops are critical to powering entrepreneurs."',
        author: {
            name: 'David Harris',
            position: 'Startup Advocate, City of Seattle'
        }
    }];

    res.render('pages/about')
})
```