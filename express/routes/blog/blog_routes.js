const express = require('express');
const router = express.Router();

const posts = [
    { id: 1, title: 'Hello Express' },
    { id: 2, title: 'Tips on Using Express JS'}
];

router.get('/', (req,res) => {
    // res.send('All blog posts');
    res.render('blogs', {title: 'My Blogs', posts});
});

router.get('/post/:id', (req, res) => {
    // 1. Get the ID from the URL parameters
    const postId = parseInt(req.params.id);

    // 2. Find the post object in your array that matches this ID
    const foundPost = posts.find(p => p.id === postId);

    // 3. Handle cases where someone inputs an invalid ID (e.g., /blogs/post/999)
    if (!foundPost) {
        return res.status(404).send('Blog post not found!');
    }

    // 4. Render the template inside the 'blog_pages' folder and pass the post object
    res.render('blog_pages/post', { post: foundPost });
});

module.exports = router;