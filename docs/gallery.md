## Example of res.locals for gallery.pug page:

### Dependenties
- <mark>res.locals.paginate = true;</mark>

```js
app.get('/gallery', (req, res, next) => {
    res.locals.paginate = true;

    res.locals.images = [{
        src: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&h=350',
        alt: 'some text here'
    }]

    res.render('pages/gallery')
})
```