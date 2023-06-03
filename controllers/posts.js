exports.getPosts = (req, res, next) => {
    res.status(200).json({ a: "aaa", b: 3 })
}

exports.createPost = (req, res, next) => {
    const {title, content} = req.body
    res.status(201).json({
        message: "Success",
        post: {
            title: title,
            body: content
        }
    })
}
