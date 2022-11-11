require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');

app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongo_username = process.env.MONGO_USERNAME;
mongo_password = process.env.MONGO_PASSWORD;

mongoose.connect("mongodb+srv://" + mongo_username + ":" + mongo_password + "@webapps.jh97p32.mongodb.net/postsDB");

const postsSchema = new mongoose.Schema({ title: 'string', content: 'string', postBy: 'string' });
const Post = mongoose.model('Post', postsSchema);

app.get('/', function (req, res) {
    Post.find({}, function (err, foundPosts) {
        res.render("home", {posts: foundPosts});
    });
});

app.get('/about', function (req, res) {
    res.render("about");
});

app.get('/contact', function (req, res) {
    res.render("contact");
});

app.get('/compose', function (req, res) {
    res.render("compose");
});

app.post('/compose', function (req, res) {
    const postToPublish = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
        postBy: req.body.postBy
    });
    postToPublish.save(function (err) {
        if (!err) {
            res.redirect('/');
        }
    });
});

app.get('/posts/:postId', function (req, res) {
    const requestedPost = req.params.postId;

    Post.findOne({_id: requestedPost}, function (err, foundPost) {
        if (!err) {
            res.render("post", {title: foundPost.title, content: foundPost.content, postBy: foundPost.postBy});
        }
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server started successfully.");
});