// ---------------- IMPORT DEPENDENCIES ----------------
const express = require('express');
const mongoose = require('mongoose');

// Initialize express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// ---------------- CONNECT TO MONGODB ----------------
mongoose.connect('mongodb://127.0.0.1:27017/postsDB')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// ---------------- CREATE SCHEMA ----------------
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// ---------------- CREATE MODEL ----------------
const Post = mongoose.model('Post', postSchema);

// ---------------- ROUTES ----------------

// i) GET all posts
app.get('/getPosts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ii) POST a new post
app.post('/addPosts', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedPost = await post.save(); // save() method
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// iii) DELETE a post by ID
app.delete('/delPosts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted successfully', deletedPost });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// iv) PATCH update a post by ID
app.patch('/post/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // return updated document
        );
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ---------------- START SERVER ----------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
