exports.add= (req, res) => {
  const { food_name, calories, serving_description, quantity } = req.body;
  if (!food_name || calories === undefined) {
    return res.status(400).send('缺少必要字段');
  }
  if (!req.session.eatenList) req.session.eatenList = [];
  req.session.eatenList.push({
    id: Date.now().toString(),
    food_name: String(food_name),
    calories: Number(calories),
    serving_description: serving_description ? String(serving_description) : '',
    quantity: quantity ? Number(quantity) : 1
  });
  res.redirect('back');
};

// 从已吃列表移除食物
exports.remove=(req, res) => {
  const { id } = req.body;
  if (req.session.eatenList) {
    req.session.eatenList = req.session.eatenList.filter(item => item.id !== id);
  }
  res.redirect('back');
};

// 查看已吃列表（调试用）
exports.show=(req, res) => {
  const list = req.session.eatenList || [];
  const totalCalories = list.reduce((sum, item) => {
    const cals = Number(item.calories) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + cals * qty;
  }, 0);
  res.json({ list, totalCalories });
};
