const { MongoClient, ObjectId } = require('mongodb');

// MongoDB Atlas 连接字符串
const uri = "mongodb+srv://hui125514_db_user:1234@cluster0.96ftjs5.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "healthypal";
const collectionName = "userbody";

// 连接数据库并获取集合
async function getCollection() {
  await client.connect();
  return client.db(dbName).collection(collectionName);
}


async function createUserBody(userBodyData) {
  const collection = await getCollection();
  try {
    // userId 是关联用户的 _id，必须传入
    const dataToInsert = {
      userId: ObjectId.createFromHexString(userBodyData.userId.toString()),
      height: Number(userBodyData.height) || null,
      weight: Number(userBodyData.weight) || null,
      gender: userBodyData.gender || null,
      birthday: userBodyData.birthday ? new Date(userBodyData.birthday) : null,
      bodyFat: userBodyData.bodyFat ? Number(userBodyData.bodyFat) : null,
      waist: userBodyData.waist ? Number(userBodyData.waist) : null,
      hip: userBodyData.hip ? Number(userBodyData.hip) : null,
      neck: userBodyData.neck ? Number(userBodyData.neck) : null,
      activityLevel: userBodyData.activityLevel || null,
      goal: userBodyData.goal || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(dataToInsert);
    return { ...dataToInsert, _id: result.insertedId };
  } finally {
    await client.close();
  }
}

// 查询所有用户的身体信息（管理员用，通常用于调试）
async function findAllUserBodies() {
  const collection = await getCollection();
  try {
    return await collection.find().toArray();
  } finally {
    await client.close();
  }
}

// 根据 MongoDB _id 查询（极少用）
async function findUserBodyById(id) {
  const collection = await getCollection();
  try {
    return await collection.findOne({ _id: new ObjectId(id) });
  } finally {
    await client.close();
  }
}

// 【核心】根据登录用户 ID 查询身体信息（前端最常用）
async function findUserBodyByUserId(userId) {
  const collection = await getCollection();
  try {
    return await collection.findOne({ 
      userId: ObjectId.createFromHexString(userId.toString()) 
    });
  } finally {
    await client.close();
  }
}

// 更新用户身体信息（支持部分更新）
async function updateUserBody(userId, updateData) {
  const collection = await getCollection();
  try {
    const cleanData = {};
    // 只更新传入的字段，并做类型转换
    if (updateData.height !== undefined) cleanData.height = Number(updateData.height) || null;
    if (updateData.weight !== undefined) cleanData.weight = Number(updateData.weight) || null;
    if (updateData.gender !== undefined) cleanData.gender = updateData.gender || null;
    if (updateData.birthday !== undefined) cleanData.birthday = updateData.birthday ? new Date(updateData.birthday) : null;
    if (updateData.bodyFat !== undefined) cleanData.bodyFat = updateData.bodyFat ? Number(updateData.bodyFat) : null;
    if (updateData.waist !== undefined) cleanData.waist = updateData.waist ? Number(updateData.waist) : null;
    if (updateData.hip !== undefined) cleanData.hip = updateData.hip ? Number(updateData.hip) : null;
    if (updateData.neck !== undefined) cleanData.neck = updateData.neck ? Number(updateData.neck) : null;
    if (updateData.activityLevel !== undefined) cleanData.activityLevel = updateData.activityLevel || null;
    if (updateData.goal !== undefined) cleanData.goal = updateData.goal || null;

    cleanData.updatedAt = new Date();

    const result = await collection.updateOne(
      { userId: ObjectId.createFromHexString(userId.toString()) },
      { $set: cleanData }
    );

    return result.modifiedCount > 0 || result.matchedCount > 0;
  } finally {
    await client.close();
  }
}

// 删除用户身体信息（用户注销时调用）
async function deleteUserBody(userId) {
  const collection = await getCollection();
  try {
    const result = await collection.deleteOne({ 
      userId: ObjectId.createFromHexString(userId.toString()) 
    });
    return result.deletedCount > 0;
  } finally {
    await client.close();
  }
}

module.exports = {
  createUserBody,
  findAllUserBodies,
  findUserBodyById,
  findUserBodyByUserId,      // 最常用
  updateUserBody,            // 最常用
  deleteUserBody
};