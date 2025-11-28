const User = require('../model/user');
const Userbody = require('../model/userbody');

exports.submit=async (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(400).send('无法识别用户，请重新注册');
  }
  try {
    const { height, weight, gender, birthday, activity, goal } = req.body;
    const user = await User.findUserByUsername(username);
    const bmr = calculateBMR({ gender, height: Number(height), weight: Number(weight), birthday: new Date(birthday) });
    const tdeeRaw = bmr ? calculateTDEE(bmr, activity) : null;
    const tdee = tdeeRaw ? Math.round(tdeeRaw) : null;
    let maximum = null, minimum = null;
    if (tdee) {
      const g = (goal || '').toLowerCase();
      if (g.includes('gain')) {
        maximum = tdee + 500;
        minimum = tdee + 200;
      } else if (g.includes('lose')) {
        maximum = tdee - 200;
        minimum = tdee - 500;
      } else {
        maximum = tdee;
        minimum = tdee;
      }
    }
    const bodyInfo = {
      userId: user._id,
      height: Number(height),
      weight: Number(weight),
      gender,
      birthday: new Date(birthday),
      activityLevel: activity || null,
      goal: goal || null,
      TDEE: tdee,
      maximumIntake: maximum,
      minimumIntake: minimum,
    };
    await Userbody.createUserBody(bodyInfo);
    res.redirect('/main');
  } catch (err) {
    console.error('保存身体信息失败:', err);
    res.status(500).send('保存失败，请重试');
  }
};



exports.update = async (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/login');

  const userId = req.session.userId;

  try {
    // 1. 取出用户真正能改的6个字段
    const { height, weight, gender, birthday, activityLevel, goal } = req.body;

    // 2. 计算年龄（你原来就有的函数）
    const getAge = (birthDate) => {
      if (!birthDate) return null;
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age;
    };

    const age = birthday ? getAge(birthday) : null;

    // 3. 计算 BMR 和 TDEE（你原来就有的函数，直接用）
    let TDEE = null;
    let maximumIntake = null;
    let minimumIntake = null;

    if (height && weight && gender && age && activityLevel) {
      const bmr = gender === 'male'
        ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

      const activityFactors = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
      };

      TDEE = Math.round(bmr * (activityFactors[activityLevel] || 1.2));

      // 根据目标计算建议摄入范围
      if (goal === 'lose') {
        maximumIntake = TDEE - 200;
        minimumIntake = TDEE - 500;
      } else if (goal === 'gain') {
        maximumIntake = TDEE + 500;
        minimumIntake = TDEE + 200;
      } else {
        maximumIntake = TDEE;
        minimumIntake = TDEE;
      }
    }

    // 4. 构造干净的要保存的数据（这三个是我们算好的！）
    const dataToSave = {
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      gender: gender || null,
      birthday: birthday ? new Date(birthday) : null,
      activityLevel: activityLevel || null,
      goal: goal || null,
      TDEE,
      maximumIntake,
      minimumIntake
    };

    // 5. 保存或更新
    const existing = await Userbody.findUserBodyByUserId(userId);
    if (existing) {
      await Userbody.updateUserBody(userId, dataToSave);
    } else {
      await Userbody.createUserBody({ userId, ...dataToSave });
    }

    res.redirect('/bodyInfo');
  } catch (err) {
    console.error('保存体测数据失败:', err);
    res.status(500).send('保存失败，请重试');
  }
};




// 营养计算工具函数
function getAgeFromDOB(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function calculateBMR({ gender, height, weight, birthday }) {
  const age = getAgeFromDOB(birthday);
  if (typeof height !== 'number' || !isFinite(height) || height <= 0 ||
    typeof weight !== 'number' || !isFinite(weight) || weight <= 0 ||
    age === null || age < 0 || !isFinite(age)) {
    return null;
  }
  const g = (gender || '').toLowerCase();
  if (g === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  }
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
}

function calculateTDEE(bmr, activity) {
  if (typeof bmr !== 'number' || !isFinite(bmr) || bmr <= 0) return null;
  const factors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  const factor = factors[(activity || '').toLowerCase()];
  if (!factor) return null;
  return bmr * factor;
}

