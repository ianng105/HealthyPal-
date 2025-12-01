const Post = require('../model/post');
const User = require('../model/user');
const Userbody = require('../model/userbody');

//====================create new post============================//
exports.createPost=(uploadPost)=async (req, res) => {
  try {
    if (!req.session || !req.session.loggedIn) {
      return res.redirect('/login');
    }
    const username = req.session.username;
    const currentUser=await User.findUserByUsername(username);
    const avatar=currentUser.avatar;
    console.log(avatar);
    const { caption, image } = req.body; 
    const eatenList = Array.isArray(req.session.eatenList) ? req.session.eatenList : [];
    const totalCalories = eatenList.reduce((sum, it) => {
      const c = Number(it.calories) || 0;
      const q = Number(it.quantity) || 1;
      return sum + c * q;
    }, 0);
    const bodyInfo = await Userbody.findUserBodyByUserId(req.session.userId);
    let healthyJudge="Unknown"
    if (bodyInfo && bodyInfo.minimumIntake && bodyInfo.maximumIntake) {
  const mIn = bodyInfo.minimumIntake / 3;
  const mAx = bodyInfo.maximumIntake / 3;

    console.log("maximum: ",mAx);
    console.log("minimum: ",mIn);
    if(totalCalories>=mIn && totalCalories<=mAx){
    	 healthyJudge="Healthy";
    }
    else if(totalCalories<mIn){
    	 healthyJudge="Unhealthy";
    }
    else{
    	 healthyJudge="Fat";
    }
  }

    const postData = {
      username,
      avatar,
      image: req.file ? '/uploads/images/'+req.file.filename : null,
      caption: typeof caption == 'string' ? caption : '',
      eatenListSnapshot: eatenList,   
      totalCaloriesSnapshot: totalCalories,    
      healthyJudge:healthyJudge,
      date: new Date()
    };

    await Post.createPost(postData);
	console.log(postData.iamge);
    return res.redirect('/main');
  } catch (err) {
    console.error('share error:', err);
    return res.status(500).send('error, try again');
  }
};
//======================update post==============================//
exports.update=(uploadPost)=async (req, res) => {
  try {
    if (!req.session.loggedIn) return res.redirect('/login');

    const postId = req.params.id;
    const post = await Post.findPostById(postId);

    if (!post || post.username !== req.session.username) {
      return res.status(403).send("no permission to edit this post");
    }

    const updateData = {
      caption: req.body.caption
    };

    if (req.file) {
      updateData.image = '/uploads/images/' + req.file.filename;
    }

    await Post.updatePost(postId, updateData);

    return res.redirect('/userProfile');
  } catch (err) {
    console.error("update failed:", err);
    res.status(500).send("error, try again");
  }
};


//======================edit post================================//
exports.edit= async (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/login');

  const postId = req.params.id;
  const post = await Post.findPostById(postId);

  if (!post || post.username !== req.session.username) {
    return res.status(403).send("you have no permission to edit this post");
  }

  res.render('newPost', {
    editing: true,
    post
  });
};

//========================main page post display================//
exports.display= async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("login");
  }
  try {

    const rawPosts = await Post.findAllPosts();
    const posts = rawPosts.map(p => ({
      ...p,
      user: { username: p.username || 'unknown' },
      avatar:p.avatar,
      image: p.image || null,
      caption: typeof p.caption === 'string' ? p.caption : '',
      healthyJudge:p.healthyJudge
    }));

    const currentUser = await User.findUserByUsername(req.session.username);
    const displayName = req.session.username || 'user';
    const eatenList = Array.isArray(req.session.eatenList) ? req.session.eatenList : [];
    const totalCalories = eatenList.reduce((sum, it) => {
      const c = Number(it.calories) || 0;
      const q = Number(it.quantity) || 1;
      return sum + c * q;
    }, 0);
    const username = req.session.username;
    res.render('main', { posts, displayName, eatenList, totalCalories, currentUser,username});
  } catch (err) {
    console.error('loading failed:', err);
    res.status(500).send('server error,fail to load');
  }
};

//=========================delete post========================//
exports.Delete=async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      return res.redirect('/login');
    }

    const postId = req.params.id;


    const post = await Post.findPostById(postId);
    if (!post) {
      return res.redirect('/userProfile?error=notfound');
    }

    if (post.username !== req.session.username) {
      return res.redirect('/userProfile?error=forbidden');
    }

    await Post.deletePost(postId);

    return res.redirect('/userProfile?success=deleted');

  } catch (err) {
    console.error('delete error:', err);
    return res.redirect('/userProfile?error=server');
  }
};
//=============================================



exports.updateOwnPost = async (req, res) => {
  try {

    const currentUserId = req.session.userId;
    const currentUsername = req.session.username;
    

    if (!currentUserId || !currentUsername) {
      return res.status(401).json({ 
        success: false, 
        message: '请先登录' 
      });
    }

    const { id } = req.params; 
    const { caption, image } = req.body; 

    const post = await Post.findPostById(id);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'post not exists' 
      });
    }
    if (post.username !== currentUsername) {
      return res.status(403).json({ 
        success: false, 
        message: 'you have no permission to edit this post' 
      });
    }


    const updateData = {};
    if (caption !== undefined) updateData.caption = caption;
    if (image !== undefined) updateData.image = image;
    updateData.updatedAt = new Date();


    const updateResult = await Post.updatePost(id, updateData);
    if (updateResult) {
      return res.status(200).json({ 
        success: true, 
        message: 'post update success',
        postId: id 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'update failed,try again' 
      });
    }

  } catch (error) {
    console.error('edit failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'server error, cannot update ' 
    });
  }
};


exports.deleteOwnPost = async (req, res) => {
  try {

    const currentUserId = req.session.userId;
    const currentUsername = req.session.username;
    

    if (!currentUserId || !currentUsername) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please login first' 
      });
    }

    const { id } = req.params;

    const post = await Post.findPostById(id);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'post not exists' 
      });
    }

    
    if (post.username !== currentUsername) {
      return res.status(403).json({ 
        success: false, 
        message: 'you have no permission to delete this post' 
      });
    }

    const deleteResult = await Post.deletePost(id);
    if (deleteResult) {
      return res.status(200).json({ 
        success: true, 
        message: 'delete success',
        postId: id 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'delete failed, try again' 
      });
    }

  } catch (error) {
    console.error('delete failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'server error, cannot delete this post' 
    });
  }
};

