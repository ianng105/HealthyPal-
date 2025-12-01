const User = require('../model/user');
const Userbody = require('../model/userbody');

exports.submit=async (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(400).send('cannot regonize user, please sign up again');
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
    console.error('body information storage failed:', err);
    res.status(500).send('saving failed, try again');
  }
};



exports.update = async (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/login');

  const userId = req.session.userId;

  try {
  
    const { height, weight, gender, birthday, activityLevel, goal } = req.body;

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

    // TDEE calculation
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

 
    const existing = await Userbody.findUserBodyByUserId(userId);
    if (existing) {
      await Userbody.updateUserBody(userId, dataToSave);
    } else {
      await Userbody.createUserBody({ userId, ...dataToSave });
    }

    res.redirect('/bodyInfo');
  } catch (err) {
    console.error('saving failed:', err);
    res.status(500).send('Error, please try again');
  }
};




//calculate age
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

//BMR calculation
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

//TDEE calculation
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



