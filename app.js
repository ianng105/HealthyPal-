const express = require("express");
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8080;

// 设置 EJS 视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// 托管静态文件（将你的 welcome.css / welcome.js / 以及 register_page.html, login.html 放到 public/ 下）
app.use(express.static(path.join(__dirname, 'public')));

// 解析表单（仅用于非文件字段）
app.use(express.urlencoded({ extended: true }));

// ========= 上传配置 =========
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const name = Date.now() + '-' + Math.random().toString(16).slice(2) + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|png|webp|gif)/.test(file.mimetype);
    cb(ok ? null : new Error('只支持图片文件'), ok);
  }
});

// 静态托管上传目录
app.use('/uploads', express.static(uploadDir));

// ========= 内存帖子存储（示例）=========
const posts = [
  {
    user: {
      username: '健康达人',
      avatar: '/images/avatar.jpg' // 头像路径（需放在 public/images 下）
    },
    image: 'https://picsum.photos/id/1/600/400', // 随机帖子图片
    caption: '今天的健身成果，坚持就是胜利！💪'
  },
  {
    user: {
      username: '美食博主',
      avatar: '/images/avatar.jpg'
    },
    image: 'https://picsum.photos/id/292/600/400',
    caption: '分享一道健康又美味的沙拉 recipe 🥗'
  }
];

// 根路由，渲染 welcome.ejs
app.get('/', (req, res) => {
  res.render('welcome'); // 首页
});

app.get('/login', (req, res) => {
  res.render('login'); // 登录页
});

app.get('/register', (req, res) => {
  res.render('register'); // 注册页
});

// 主页面（仿 Instagram 布局），使用内存 posts
app.get('/main', (req, res) => {
  res.render('main', { posts });
});

// Body Info 页面
app.get('/bodyInfo', (req, res) => {
  res.render('bodyInfo');
});

// Body Info Form 页面
app.get('/bodyInfoForm', (req, res) => {
  res.render('bodyInfoForm');
});

// 渲染发帖页面
app.get('/newPost', (req, res) => {
  res.render('newPost'); // 请确保 view/newPost.ejs 已存在
});

// 接收发布（图片 + 文本）
app.post('/newPost', upload.single('image'), (req, res) => {
  try {
    const username = (req.body.username || '').trim() || '匿名用户';
    const caption = (req.body.caption || '').trim();

    if (!req.file) {
      return res.status(400).send('请上传一张图片');
    }

    const imageUrl = '/uploads/' + req.file.filename;

    const newPost = {
      user: {
        username,
        avatar: '/images/avatar.jpg' // 可替换为真实登录用户头像
      },
      image: imageUrl,
      caption
    };

    // 新帖插入最前
    posts.unshift(newPost);

    // 跳转到主页查看新帖
    res.redirect('/main');
  } catch (err) {
    console.error(err);
    res.status(500).send('发布失败，请稍后重试');
  }
});

app.get('/logout', (req, res) => {
  res.redirect('login');
});

async function start() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();