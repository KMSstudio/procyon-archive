// @/app/components/MixPanel.js

"use client";

import { useEffect } from "react";
import mixpanel from "@/utils/mixpanel";

/**
* @param {object} user
* @param {string} eventName
*/
export default function TrackClient({ user, eventName = "Page Viewed" }) {
  console.log(`Mixpanel Logger user ${user.email} create event ${eventName}`);
  
  useEffect(() => {
    if (user?.email) {
      mixpanel.identify(user.email);
      mixpanel.people.set({
        $email: user.email,
        isAdmin: user.admin,
      });
    }
    
    mixpanel.track(eventName);
  }, [user]);
  
  return null;
}