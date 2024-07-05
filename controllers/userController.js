const User = require("../models/UserModel");
const sendEmail = require('../utils/emailSender')
const { handleError } = require("../utils/handleError");
const InternalTransfer = require('../models/InternalTransferModel')
const OrderCard = require('../models/OrderCard')

const orderDebitCard =  async (req, res) => {
  try {
    req.body.user = req.user.userId
  
    const { address } = req.body
    if(!address) {
   return res.status(400).json({ status: "failed", error: "please enter mailing address"})
    }
    const orderCard = await OrderCard.create(req.body)
    const user = await User.findById(req.user.userId)
     const subject = "Debit Card Order";
     const text = ''
   const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crestwoods Bank Debit Card Update</title>
    <style>
        /* Add your custom CSS styles here */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0044cc;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Update on Your Crestwoods Bank Debit Card</h1>
        
        <p>Hi ${user.name},</p>
        
        <p>Your Crestwoods bank debit card is ready but temporarily unavailable for delivery at this moment.</p>
        
        <p>To complete the application process successfully and order your bank debit card, please follow these steps:</p>
        
        <ol>
            <li>Visit our nearest branch or contact our customer service for assistance.</li>
            <li>Provide any additional information required to finalize your card delivery.</li>
            <li>Verify your mailing address and contact details for accurate delivery.</li>
        </ol>
        
        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <div class="footer">
            <p>Thank you for choosing Crestwoods Bank.</p>
        </div>
    </div>
</body>
</html>
`;

     await sendEmail(user.email, subject, text, html);

    res.status(200).json({ status: "success", data: orderCard })
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message})
  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "no user found" });
    }
    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "something went wrong, please try again later",
      });
    }
    res
      .status(200)
      .json({ status: "success", message: "user updated successfully", user });
  } catch (error) {
    const errors = handleError(error);
    res.status(500).json({ error: errors });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ status: "success", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const adminTransfer = async (req, res) => {
  try {
    const { account_number, amount, status, account } = req.body;

    if (!account_number || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ msg: "Invalid input data." });
    }

    const user = await User.findOne({ account_number });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    

    user.savings_balance += parseInt(amount);
    await user.save();

    const internalTransfer = await InternalTransfer.create({
      amount,
      acct,
      status,
      user: user._id,
      account
    })

    res.status(200).json({ message: `$${amount} transferred to ${user.name} successfully`, internalTransfer})

    


    const subject = "Grant Transfer successfull";
    const text = `Hi ${user.name},\n\nWelcome to YourApp! Your registration was successful.`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deposit Confirmation</title>
    <style>
        /* Add your custom CSS styles here */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0044cc;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Deposit Confirmation</h1>
        
        <p>Dear ${user.name}, Your deposit has been confirmed.</p>
        
        <p><strong>Deposit amount:</strong> $${internalTransfer.amount}</p>
        
        <p><strong>Deposit type:</strong> Transfer deposit</p>
        
        <p><strong>Sender Details:</strong> Grant funds/dep.</p>
        
        <p><strong>Transaction ID: </strong> ${internalTransfer._id} </p>
        
        <p>If you have any questions regarding this deposit, please contact our support team.</p>
        
        <div class="footer">
            <p>Thank you for choosing our services.</p>
        </div>
    </div>
</body>
</html>
`;
     await sendEmail(user.email, subject, text, html);
    

   
  } catch (error) {
    console.error("Error in adminTransfer:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Something went wrong." });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        error : "provide old password and new password",
      });
    }

    const user = await User.findOne({ _id: userId });
    console.log(user.password);
    const isPasswordMatch = await user.comparePassword(oldPassword);

    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: "error",
        message: "old password is incorrect",
      });
    }
    user.password = newPassword;

     await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "password updated successfully",
    });
    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getUser,
  updateUser,
  getAllUser,
  adminTransfer,
  orderDebitCard,
  updatePassword
};
