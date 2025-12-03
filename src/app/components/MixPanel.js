// @/app/components/MixPanel.js

"use client";

import { useEffect } from "react";
import mixpanel from "@/utils/mixpanel";

/**
* @param {object} user
* @param {string} eventName
*/
export default function TrackClient({ user, eventName = "Page Viewed" }) {
  const email = user?.email || "unidentified user";
  console.log(`Mixpanel Logger user ${email} create event ${eventName}`);
  useEffect(() => {
    mixpanel.identify(email);
    mixpanel.people.set({
      $email: email,
      isAdmin: !!user?.admin,
    });
    mixpanel.track(eventName, {
      email: email,
    });
  }, []);

  return null;
}
