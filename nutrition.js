// utils/nutrition.js
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

// gender: 'male' | 'female' | 'other'
// height(cm), weight(kg), birthday(Date|ISO string)
function calculateBMR({ gender, height, weight, birthday }) {
  const age = getAgeFromDOB(birthday);
  if (
    typeof height !== 'number' || !isFinite(height) || height <= 0 ||
    typeof weight !== 'number' || !isFinite(weight) || weight <= 0 ||
    age === null || age < 0 || !isFinite(age)
  ) {
    return null;
  }

  const g = (gender || '').toLowerCase();
  if (g === 'male') {
    // Men: BMR = 88.362 + (13.397 x kg) + (4.799 x cm) – (5.677 x age)
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  }
  // Women: BMR = 447.593 + (9.247 x kg) + (3.098 x cm) – (4.330 x age)
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
}

// activity: '', 'sedentary','light','moderate','active','very_active'
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

module.exports = { calculateBMR, calculateTDEE, getAgeFromDOB };