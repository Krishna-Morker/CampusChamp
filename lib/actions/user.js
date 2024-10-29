import User from '../models/usermodel';

import { connect } from '../mongodb/mongoose';

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) => {
  try {
    await connect();

    let user = await User.findOne({ clerkId: id });

  // If the user is not found, create a new user
  if (!user) {
    user = await User.create({
      clerkId: id,
      firstName: first_name,
      lastName: last_name,
      avatar: image_url,
      email: email_addresses[0]?.email_address, // Optional chaining for safety
      username,
    });
  } else {
    // If the user is found, update their details
    user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          avatar: image_url,
          email: email_addresses[0]?.email_address,
          username,
        },
      },
      { new: true }
    );
  }
    return user;
  } catch (error) {
    console.log('Error creating or updating user:', error);
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();

    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log('Error deleting user:', error);
  }
};