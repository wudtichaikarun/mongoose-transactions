const mongoose = require("mongoose");
// for currency calculation handling
const $ = require("currency.js");

const init = require("./init");

async function handleMoneyTransfer(senderAccountId, receiverAccountId, amount) {
  // connect the DB and get the User Model
  const User = await init();

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    /**
     * STEP 1 We subtract $10 to John’s account
     */
    // always pass session to find queries when the data is needed for the transaction session
    const sender = await User.findOne({ accountId: senderAccountId }).session(
      session
    );

    // calculate the updated sender balance
    sender.balance = $(sender.balance).subtract(amount);

    // if funds are insufficient, the transfer cannot be processed
    if (sender.balance < 0) {
      throw new Error(`User - ${sender.name} has insufficient funds`);
    }

    // save the sender updated balance
    // do not pass the session here
    // mongoose uses the associated session here from the find query return
    // more about the associated session ($session) later on
    await sender.save();

    /**
     * STEP 2  We add $10 to Jane’s account
     */
    const receiver = await User.findOne({
      accountId: receiverAccountId
    }).session(session);

    // to make step 2 error
    throw new Error("receiver failed");

    receiver.balance = $(receiver.balance).add(amount);

    await receiver.save();

    // commit the changes if everything was successful
    await session.commitTransaction();

    return {
      senderBalance: sender.balance,
      receiverBalance: receiver.balance
    };
  } catch (error) {
    // if anything fails above just rollback the changes here

    // this will rollback any changes made in the database
    await session.abortTransaction();

    // logging the error
    console.error(error);

    // rethrow the error
    throw error;
  } finally {
    // ending the session
    session.endSession();
  }
}

handleMoneyTransfer("ACC001", "ACC002", 10).then(data =>
  console.log("response", data)
);
