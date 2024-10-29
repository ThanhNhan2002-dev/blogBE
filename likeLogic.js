const fs = require('fs');
const filePath = 'likes.json';

const readFile = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

const writeFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const likePost = (idPost, username) => {
    const likes = readFile();
    const likeExists = likes.some(like => like.idPost === idPost && like.username === username);
    if (likeExists) {
        return { success: false, message: 'User already liked this post' };
    }

    const newLike = {
        id: new Date().getTime(),
        idPost,
        username,
        createAt: new Date(),
    };
    likes.push(newLike);
    writeFile(likes);

    return { success: true, newLike };
};

const unlikePost = (idPost, username) => {
    const likes = readFile();
    const likeIndex = likes.findIndex(like => like.idPost === idPost && like.username === username);
    if (likeIndex !== -1) {
        likes.splice(likeIndex, 1);
        writeFile(likes);
        return { success: true, message: 'Unlike successful' };
    }
    return { success: false, message: 'Like not found for this user and post' };
};

const getLikesByPost = (idPost) => {
    const likes = readFile();
    return likes.filter(like => like.idPost === idPost);
};
const getLikes = () => {
    return readFile();
};

module.exports = { likePost, unlikePost, getLikesByPost, getLikes };
