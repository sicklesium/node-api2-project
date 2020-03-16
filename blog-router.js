const express = require('express');
const db = require('./data/db.js');

const router = express.Router();

// POSTS 

// POST request for posts
router.post('/', (req, res) => {
    const { title, contents } = req.body;
    const dbInfo = req.body;

    if (title && contents) {
        db.insert(dbInfo)
            .then((db) => {
                res.status(201).json({ success: true, db });
            })
            .catch((err) => {
                res.status(500).json({ errorMessage: "There was an error while saving the post to the database" });
            });
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }

});

// GET request for all posts
router.get('/', (req, res) => {
    db.find()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The posts information could not be retrieved." });
        });
});

// GET request for specific post
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json({ success: true, post });
            } else {
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The post information could not be retrieved." });
        });
});

// PUT request for specific post
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const dbInfo = req.body;
    const { title, contents } = req.body;

    if (title && contents) {
        db.update(id, dbInfo)
            .then(post => {
                if (post) {
                    res.status(200).json({ success: true, post });
                } else {
                    res.status(404).json({ errorMessage: "The post with the specified ID does not exist." });
                }
            })
            .catch(err => {
                res.status(500).json({ errorMessage: "The post information could not be modified." });
            });
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
});

// DELETE request for specific post
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(deletedPost => {
            if (deletedPost) {
                res.status(201).json({ success: true, deletedPost });
            } else {
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The post could not be removed." })
        })
})

// COMMENTS 

// POST request for comments on a specific post
router.post('/:id/comments', (req, res) => {
    const { text } = req.body;
    const { id } = req.params.id;
    const newComment = { ...req.body, post_id: id };
    const post_id = req.params.id;

    if (text) {
        db.findById(id)
            .then(post => {
                if (post.length > 0) {
                    db.insertComment({ text, post_id })
                        .then((post) => {
                            res.status(200).json(post);
                        })
                        .catch(err => {
                            res.status(500).json({ errorMessage: "There was an error while saving the comment to the database." })
                        })
                } else {
                    res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
                }
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
})

// GET request for comments on a specific post
router.get('/:id/comments', (req, res) => {
    const post_id = req.params.id;

    db.findPostComments(post_id)
        .then(post => {
            if (post.length > 0) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The comments information could not be retrieved." });
        });
})

module.exports = router;