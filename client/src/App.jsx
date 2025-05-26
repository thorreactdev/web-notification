// client/src/App.jsx

import { getToken, onMessage } from "firebase/messaging";
import { Button } from "./components/ui/button";
import { Bell, Loader, Variable } from "lucide-react";
import axios from "axios";
import { messaging } from "./config/firebaseConfig";
import { useEffect, useState } from "react";
import { toast } from "./hooks/use-toast";
import { ToastAction } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [loading, setLoading] = useState(false);


  //function to handle subscription to push notifications
  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast({
          title: "Permission not granted",
          description: "You need to allow notifications to subscribe.",
        })
        return;
      }
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        // Send token to backend
        const response = await axios.post(
          `http://localhost:5000/api/devices/register`,
          { fcm_token: token }
        );
        if (response.status === 200) {
          toast({
            title : response.data.message || "Subscribed Successfully",
          })
        }
      } else {
        toast({
          title : "No registration token available. Request permission to generate one.",
        });
      
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };
  
  //just to send a test notification
  // This function sends a test notification to the backend which will be queued for delivery just for testing purposes
  const sendNotification = async () => {
    try {
      const notification = {
        title: "One piece Anime Notification",
        body: "Luffy is the best anime character and he is the main character of One Piece",
        data: { link: "https://claude.ai/" },
        image_url: "https://c3.klipartz.com/pngpicture/451/372/sticker-png-one-piece-monkey-d-luffy-one-piece-luffy-thumbnail.png",
        action_url: "https://www.pinterest.com/ideas/luffy-no-background-png/935970568891/",
      };
      const res = await axios.post(
        `http://localhost:5000/api/notifications/publish`,
        notification
      );
      if (res.status === 200) {
        console.log("Notification queued successfully");
      }else{
        toast({
          title: "Failed to queue notification",
          description: "Please try again later.",
        })
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Failed to send notification");
    }
  };

  useEffect(() => {
    onMessage(messaging, (payload) => {

      const notification = payload.notification || {};
      const data = payload.data || {};

      const notificationTitle = notification.title || "Default Title";
      const notificationBody = notification.body || "You have a new message!";
      const notificationIcon = notification.image || data.image_url || "/default-icon.png";
      const notificationLink = data.link || "https://example.com";


      if (Notification.permission === 'granted') {
        const foregroundNotification = new Notification(notificationTitle, {
          body: notificationBody,
          icon: notificationIcon,
          data: { link: notificationLink }
        });

        foregroundNotification.onclick = (event) => {
          event.preventDefault();
          window.open(notificationLink, '_blank');
        };
      } else {
        console.warn("Notification permission not granted.");
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen max-w-7xl mx-auto p-3">
      <Toaster/>
      <h1 className="text-[30px] md:text-[69px] text-center font-extrabold text-white-1 leading-tight">
        Welcome to the Push <br />{" "}
        <span className="text-[#faecca]">Notification</span> Service App
      </h1>
      <p className="text-xs md:text-sm text-white-2 font-normal text-center">
        This is a simple application that demonstrates how to use push
        notifications with a service worker <br className="hidden md:block" /> 
        You can use this app to send and receive push notifications in your browser.
      </p>

      <div className="mt-4">
        <Button
          className="flex items-center gap-2 w-[300px] md:w-[400px] bg-orange-1 text-white-1 py-6 font-semibold hover:bg-orange-600 transition-all duration-300"
          onClick={handleSubscribe}
        >
          {loading ? <span className="flex items-center gap-2">
            <Loader className="animate-spin h-4 w-4" />
            Subscribing...
          </span> : <span className="flex items-center gap-2">
             <Bell /> Subscribe Now
            </span>}
         
        </Button>

        <Button
          className="flex items-center gap-2 mt-3 w-[300px] md:w-[400px] bg-green-600 text-white-1 py-6 font-semibold hover:bg-green-700 transition-all duration-300"
          onClick={sendNotification}
        >
          Send Notification
        </Button>
      </div>
    </div>
  );
}

export default App;
