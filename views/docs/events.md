## Example of res.locals for events.pug page:

### Dependenties
- <mark>res.locals.moment = require('moment')</mark>
- <mark>res.locals.paginate = true;</mark>

```js
app.get('/events', (req, res, next) => {
    res.locals.paginate = true;

    res.locals.events = [{
        date: new Date('10/16/2016'),
        startTime: new Date('2016-10-16T21:00:00'),
        endTime: new Date('2016-10-17T02:00:00'),
        title: 'My title',
        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy',
        content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.',
        thumbnail: 'http://www.dolby-gallery.com/web/wp-content/uploads/2013/03/featured-image-600x350-crank-wojcik.jpg',
        list: ['Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis', 'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis']
    }]

    res.render()
})
```