const User = require("../model/user");


exports.login= async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.redirect('/login?error=empty');
    }
    const user = await User.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.redirect('/login?error=invalid');
    }
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.username = user.username;
    req.session.loggedIn = true;
    res.redirect('/main');
  } catch (error) {
    console.error('登录错误:', error);
    res.redirect('/login?error=server');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout error:', err);
    res.redirect('/login');
  });
};
