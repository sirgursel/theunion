## Example of res.locals for members.pug page:

### Dependenties
- <mark>res.locals._ = require('lodash')</mark>

> res.locals.currentMember - index of the member, whose infomation has to be shown on a page (main info like background, bio, social links, profile and other stuff..)

Note: All res.locals.members will be display in the section "Other team members" on the page. "currentMember" will be removed from that section.

res.locals.members.length has to be at least _3_. No maximum limit.

```js
app.get('/members', (req, res, next) => {
    res.locals.currentMember = 0;
    
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
    }]

    res.render('pages/members')
})
```