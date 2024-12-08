## Example of res.locals for blog.single.pug page:

### Dependenties

```ts
res.locals.blogTags: [String] = ['Startup', 'Tips', 'Founders', 'News', 'Work', 'Freelance'];
res.locals.blogCategories: [String] = ['All Categories', 'Startup news', 'Founder talk', 'Mentor tips', 'Tech talk', 'Business', 'Events', 'Review'];
res.locals.blogPopular: [{title: String, link: String}] = [{title: 'Be Creative, Be Innovative, Be Resilient', link: '#'}, {title: 'How to Find Startup Co-Founders', link: '#'}, {title: 'Benefits of running startup from working space', link: '#'}, {title: 'How to Find Startup Co-Founders', link: '#'}, {title: 'Be Creative, Be Innovative, Be Resilient', link: '#'}];

```

```js
app.get('/blog/:blog_id', (req,res,next) => {
    res.locals.title = "Blog";

    res.locals.paginate = true;

    res.locals.blog = {
        title: 'Be Creative, Be Innovative, Be Resilient',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam ipsa quae optio debitis officiis',
        date: 'October 17, 2018',
        link: '#',
        thumbnail: 'http://www.digitalmeetsculture.net/wp-content/uploads/2015/04/article.jpg',
        author: {
            url: '#',
            thumbnail: 'https://www.cbpp.org/sites/default/files/styles/crop_228x228/public/thumbnails/image/will_fischer-500x500.jpg?itok=-N194QwZ',
            name: 'Stephanie Romero',
            content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat quis. nostrud exerci tation ullamcorper suscipit lobortis nisl'
        }
    };

    res.locals.blogTags = ['Startup', 'Tips', 'Founders', 'News', 'Work', 'Freelance'];
    res.locals.blogCategories = ['All Categories', 'Startup news', 'Founder talk', 'Mentor tips', 'Tech talk', 'Business', 'Events', 'Review'];
    res.locals.blogPopular = [{title: 'Be Creative, Be Innovative, Be Resilient', link: '#'}, {title: 'How to Find Startup Co-Founders', link: '#'}, {title: 'Benefits of running startup from working space', link: '#'}, {title: 'How to Find Startup Co-Founders', link: '#'}, {title: 'Be Creative, Be Innovative, Be Resilient', link: '#'}];

    res.render('pages/blog/index');
})
```