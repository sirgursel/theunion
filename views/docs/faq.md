## Example of res.locals for events.pug page:

### Dependenties

```js
app.get('/faq', (req,res,next) => {
    res.locals.title = "Frequently asked questions";

    res.locals.questions = [{
        question: 'Do I Need To Register Before Placing An Order?',
        answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores commodi ab voluptatibus unde quis corporis deleniti quia natus ipsam rerum non aliquam eius possimus nihil maiores sed, blanditiis odio voluptatum.'
    },
    {
        question: 'How Do I Register?',
        answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores commodi ab voluptatibus unde quis corporis deleniti quia natus ipsam rerum non aliquam eius possimus nihil maiores sed, blanditiis odio voluptatum.'
    },
    {
        question: 'Why Should I Become A Registered User?',
        answer: 'You will not be required to re-enter your shipping or billing addresses every time you order online. Whenever you place an order, it will be delivered to the registered address on file, unless you direct us otherwise.\n You can browse, shop and, if necessary, complete your order at a later time. We\'ll keep track of the items you\'ve already put in your shopping bag so that when you come back later, you will not have to re-select the items again. Note that placing items to your shopping bag for purchase at a later time does not guarantee item availability.\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.'
    },
    {
        question: 'How Do I Reset My Password?',
        answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores commodi ab voluptatibus unde quis corporis deleniti quia natus ipsam rerum non aliquam eius possimus nihil maiores sed, blanditiis odio voluptatum.'
    },
    {
        question: 'How Do I Change My Account Information?',
        answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores commodi ab voluptatibus unde quis corporis deleniti quia natus ipsam rerum non aliquam eius possimus nihil maiores sed, blanditiis odio voluptatum.'
    },
    {
        question: 'Can I Change My Email Address In My Account?',
        answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores commodi ab voluptatibus unde quis corporis deleniti quia natus ipsam rerum non aliquam eius possimus nihil maiores sed, blanditiis odio voluptatum.'
    },
    {
        question: 'I Cannot Find The Answers To My Questions, How Do I Reach Customer Service?',
        answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores commodi ab voluptatibus unde quis corporis deleniti quia natus ipsam rerum non aliquam eius possimus nihil maiores sed, blanditiis odio voluptatum.'
    }]

    res.render('pages/faq')
})
```