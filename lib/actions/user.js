import User from '../models/usermodel';

import { connect } from '../mongodb/mongoose';

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  external_accounts,
  username,
) => {
  try {
    await connect();

    let user = await User.findOne({ clerkId: id });
  if (!user) {
    user = await User.create({
      clerkId: id,
      firstName: first_name,
      lastName: last_name,
      avatar: image_url,
      email: email_addresses[0]?.email_address, // Optional chaining for safety
      username:external_accounts[0].given_name,
    });
  } else {
    // If the user is found, update their details
    
          user.firstName=first_name,
          user.lastName=last_name,
          user.avatar= image_url,
          user.email=email_addresses[0]?.email_address,
          user.username=username
  }
  const regex = /^[a-zA-Z0-9._%+-]+@mnnit\.ac\.in$/;
  user.prof= regex.test(user.email);
  await user.save();
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

export const getUser = async (id) => {
  try {
    await connect();
    const user=await User.findOne({ email: email });
    return user;
  } catch (error) {
    console.log('Error deleting user:', error);
  }
};