import User from '../mongodb/models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

const getAllUsers = async (req, res) => {
  try {
    const { role, _end } = req.query;

    const query = role ? { role } : {};
    const users = await User.find(query).limit(_end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};


const createUser = async (req, res) => {
  try {
    const { name, email, avatar, role, deviceToken} = req.body; // Add deviceToken here

    const userExists = await User.findOne({ email });

    if (userExists) return res.status(200).json(userExists)

    const newUser = await User.create({
      name,
      email,
      avatar,
      deviceToken, // And here
      role: role || 'SecurityStaff', // Set the user role to 'SecurityStaff' if not provided in the request body
    });

    res.status(200).json(newUser);

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};


const getUserInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).populate('allReports');

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, avatar, role, deviceToken } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    avatar,
    role: role || 'Student',
    deviceToken,
  });

  res.status(201).json(user);
};


const loginUser = async (req, res) => {
  const { email, password, deviceToken } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (deviceToken) {
      user.deviceToken = deviceToken;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role }, // Include the user role in the JWT token
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { payload } = req.body;

    // Get the device tokens of all SecurityStaff users
    const users = await User.find({ role: 'SecurityStaff' });
    const tokens = users.map(user => user.deviceToken);

    if (tokens.length === 0) {
      return res.status(404).json({ message: 'No SecurityStaff users found' });
    }

    let failedTokens = [];

    await Promise.all(tokens.map(async (token) => {
      try {
        await admin.messaging().send({ tokens: [token], payload: payload });
      } catch (error) {
        console.error(`Failed to send notification to device token: ${token}`);
        failedTokens.push(token);
      }
    }));

    if (failedTokens.length > 0) {
      return res.status(500).json({
        message: `Failed to send notifications to some device tokens`,
        failedTokens: failedTokens,
      });
    }

    res.status(200).json({ message: 'Notification sent' });

  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  getAllUsers,
  updateUser,
  createUser,
  getUserInfoById,
  registerUser,
  loginUser,
  sendNotification,
};
