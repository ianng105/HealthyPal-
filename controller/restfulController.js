const Post = require('../model/post');
const User = require('../model/user');
const Userbody = require('../model/userbody');

//=======================Restful API - read
exports.read=async (req, res) => {
  try {
    const result = await Post.findPostByUsername(req.params.username);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: '获取帖子失败' });
  }
};

// RESTful API - 创建帖子
exports.create= (uploadPost)=async (req, res) => {
  try {
    const { username,image, calories, caption } = req.body;
    const un = await User.findUserByUsername(username);
    const body = await Userbody.findUserBodyByUserId(un._id);
    const mIn=body.minimumIntake
    const mAx=body.maximumIntake;
    let healthyJudge = "";
    if(calories>=mIn && calories<=mAx){
    	healthyJudge="Healthy";
    }
    if(calories>mAx){
    	healthyJudge="Fat";
    }
    if(calories<mIn){
    	healthyJudge="Unhealthy";
    }
    const postData = {
      username: un.username,
      image:req.file ? '/uploads/images/'+req.file.filename : null,
      calories: Number(calories),
      caption,
      healthyJudge,
      date: new Date()
    };
    const result = await Post.createPost(postData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: '创建帖子失败' });
  }
};

//========================RESTful API - update
exports.update=async (req, res) => {
  try {
    const {caption ,calories} = req.body;
    const updateData = {calories: Number(calories), caption };
    await Post.updatePost(req.params.post_id, updateData);
    const result = await Post.findPostById(req.params.post_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: '更新帖子失败' });
  }
};

// RESTful API - 删除帖子
exports.Delete=async (req, res) => {
  try {
    await Post.deletePost(req.params.post_id);
    res.status(200).json({ message: "删除成功" });
  } catch (err) {
    res.status(500).json({ error: '删除帖子失败' });
  }
};
