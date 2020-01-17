const mongoose = require("mongoose");

// the run-rs command will by default start the replica sets on the following ports
const dbUri =
  "mongodb://localhost:27017,localhost:27018,localhost:27019/example";

async function init() {
  // connecting the DB
  await mongoose.connect(dbUri, { replicaSet: "rs" });

  // a simple mongoose model
  const User = mongoose.model(
    "User",
    new mongoose.Schema({
      accountId: String,
      name: String,
      balance: Number
    })
  );

  User.createCollection();

  const countUsers = await User.count();
  const emptyUser = countUsers === 0;
  if (emptyUser) {
    // creating two users
    await User.create([
      { accountId: "ACC001", name: "John", balance: 50.0 },
      { accountId: "ACC002", name: "Jane", balance: 50.0 }
    ]);
  }

  return User;
}

module.exports = init;
