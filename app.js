const express = require('express'); // Import Express framework để xây dựng ứng dụng web và API
const app = express(); // Tạo một ứng dụng Express
const cors = require('cors'); // Import middleware CORS để cho phép chia sẻ tài nguyên từ các domain khác
const jwt = require("jsonwebtoken"); // Import thư viện JSON Web Token (JWT) để xác thực người dùng
const authLogic = require('./authLogic'); // Import module logic để xử lý đăng ký và đăng nhập
const postLogic = require('./postLogic'); // Import module logic để quản lý bài viết
const likeLogic = require('./likeLogic'); // Import module logic để xử lý like/unlike bài viết
const SECRET_KEY = "MY_TOKEN"; // Khóa bí mật dùng để mã hóa và giải mã JWT

// Sử dụng middleware CORS để bật cơ chế chia sẻ tài nguyên giữa các domain
app.use(cors());
// Sử dụng middleware để parse dữ liệu JSON trong các request body
app.use(express.json());

// Khởi động server tại cổng 3000 và in ra thông báo khi server đã sẵn sàng
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// Middleware xác thực JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']; // Lấy token từ header của request
    if (!token) return res.status(401).json({ message: "Access denied" }); // Nếu không có token, trả về lỗi 401

    // Xác thực token bằng khóa bí mật
    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" }); // Nếu token không hợp lệ, trả về lỗi 403
        req.user = user; // Lưu thông tin user đã xác thực vào request
        next(); // Tiếp tục xử lý request
    });
}

// Đăng ký tài khoản mới
app.post('/register', (req, res) => {
    const { username, password, dob, image } = req.body; // Lấy thông tin từ request body
    const result = authLogic.register(username, password, dob, image); // Gọi logic đăng ký với các thông tin được cung cấp
    if (result.success) {
        res.json(result); // Nếu thành công, trả về thông tin tài khoản mới đăng ký
    } else {
        res.status(400).json(result); // Nếu thất bại, trả về lỗi 400 với lý do thất bại
    }
});

// Đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Lấy thông tin từ request body
    const result = await authLogic.login(username, password); // Gọi logic đăng nhập
    if (result.success) {
        res.json(result); // Nếu thành công, trả về thông tin user và token JWT
    } else {
        res.status(401).json(result); // Nếu thất bại, trả về lỗi 401
    }
});

// Reset mật khẩu
app.post('/forgot-password', (req, res) => {
    const { username } = req.body; // Lấy username từ request body
    const result = authLogic.resetPassword(username); // Gọi logic reset mật khẩu
    if (result.success) {
        res.json(result); // Nếu thành công, trả về thông tin reset thành công
    } else {
        res.status(404).json(result); // Nếu thất bại (username không tồn tại), trả về lỗi 404
    }
});

// Sử dụng middleware xác thực cho các route phía dưới
app.use(authenticateToken);

// Lấy danh sách bài viết
app.get('/posts', (req, res) => {
    res.json(postLogic.getPosts()); // Trả về danh sách các bài viết từ postLogic
});

// Tạo bài viết mới
app.post('/posts', (req, res) => {
    const username = req.user.username; // Lấy thông tin username từ token đã xác thực
    const { title, content, status, type } = req.body; // Lấy thông tin bài viết từ request body
    const newPost = postLogic.createPost(title, content, username, status, type); // Gọi logic tạo bài viết mới
    res.json(newPost); // Trả về bài viết mới tạo
});

// Lấy danh sách các lượt like
app.get('/likes', (req, res) => {
    res.json(likeLogic.getLikes()); // Trả về danh sách like từ likeLogic
});

// Lấy thông tin bài viết theo ID
app.get('/posts/:id', (req, res) => {
    const post = postLogic.getPostById(+req.params.id); // Gọi logic lấy bài viết theo ID
    if (post) {
        res.json(post); // Nếu tìm thấy bài viết, trả về bài viết
    } else {
        res.status(404).json({ message: 'Post not found' }); // Nếu không tìm thấy, trả về lỗi 404
    }
});

// Cập nhật bài viết theo ID
app.put('/posts/:id', (req, res) => {
    const updatedPost = postLogic.updatePost(+req.params.id, req.body); // Gọi logic cập nhật bài viết theo ID
    if (updatedPost) {
        res.json(updatedPost); // Nếu cập nhật thành công, trả về bài viết đã cập nhật
    } else {
        res.status(404).json({ message: 'Post not found' }); // Nếu không tìm thấy bài viết, trả về lỗi 404
    }
});

// Xóa bài viết theo ID
app.delete('/posts/:id', (req, res) => {
    const deletedPost = postLogic.deletePost(+req.params.id); // Gọi logic xóa bài viết theo ID
    if (deletedPost) {
        res.json({ message: 'Post deleted' }); // Nếu xóa thành công, trả về thông báo đã xóa
    } else {
        res.status(404).json({ message: 'Post not found' }); // Nếu không tìm thấy bài viết, trả về lỗi 404
    }
});

// Like bài viết theo ID
app.post('/posts/:id/like', (req, res) => {
    const username = req.user.username; // Lấy thông tin username từ token đã xác thực
    const result = likeLogic.likePost(+req.params.id, username); // Gọi logic like bài viết theo ID
    if (result.success) {
        res.json(result); // Nếu thành công, trả về kết quả like
    } else {
        res.status(400).json(result); // Nếu thất bại, trả về lỗi 400
    }
});

// Unlike bài viết theo ID
app.post('/posts/:id/unlike', (req, res) => {
    const username = req.user.username; // Lấy thông tin username từ token đã xác thực
    const result = likeLogic.unlikePost(+req.params.id, username); // Gọi logic unlike bài viết theo ID
    if (result.success) {
        res.json(result); // Nếu thành công, trả về kết quả unlike
    } else {
        res.status(400).json(result); // Nếu thất bại, trả về lỗi 400
    }
});

// Lấy danh sách like của bài viết theo ID
app.get('/posts/:id/likes', (req, res) => {
    const likes = likeLogic.getLikesByPost(+req.params.id); // Gọi logic lấy danh sách like của bài viết theo ID
    res.json(likes); // Trả về danh sách like
});

// Cập nhật thông tin cá nhân
app.put('/users/update-profile', (req, res) => {
    const username = req.user.username; // Lấy thông tin username từ token đã xác thực
    const updatedData = req.body; // Lấy thông tin cần cập nhật từ request body
    const result = authLogic.updateUser(username, updatedData); // Gọi logic cập nhật thông tin user
    if (result.success) {
        res.json(result); // Nếu cập nhật thành công, trả về thông tin user đã cập nhật
    } else {
        res.status(404).json(result); // Nếu thất bại, trả về lỗi 404
    }
});

// Lấy thông tin cá nhân
app.get('/users/get-profile', (req, res) => {
    const username = req.user.username; // Lấy thông tin username từ token đã xác thực
    const result = authLogic.getInfo(username); // Gọi logic lấy thông tin user
    if (result.success) {
        res.json(result); // Nếu thành công, trả về thông tin cá nhân
    } else {
        res.status(404).json(result); // Nếu không tìm thấy, trả về lỗi 404
    }
});
