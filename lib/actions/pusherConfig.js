import Pusher from 'pusher';

// Initialize Pusher with environment variables
const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,  // Your app ID from .env
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,      // Your key from .env
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET,// Your secret from .env
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER, // Your cluster from .env
  useTLS: true,
});

export default pusher;