const Booking = require("../models/Booking");

const assignGroups = async (subEventId) => {
  // Get all confirmed bookings for the given subEvent
  const bookings = await Booking.find({ subEvent: subEventId });

  if (bookings.length === 0) {
    throw new Error("No bookings found for this subEvent.");
  }

  // Get previous sub-event bookings to track past groupings
  const previousBookings = await Booking.find({
    author: { $in: bookings.map((b) => b.author) },
    subEvent: { $ne: subEventId },
    groupId: { $ne: 0 },
  });

  // Create a map of previous groupings
  const previousGroups = new Map();
  previousBookings.forEach((booking) => {
    if (!previousGroups.has(booking.author.toString())) {
      previousGroups.set(booking.author.toString(), new Set());
    }
    previousGroups.get(booking.author.toString()).add(booking.groupId);
  });

  let groupId = 1;
  const groups = [];
  const ungroupedUsers = [...bookings];

  while (ungroupedUsers.length > 0) {
    let group = [];
    let tempUsers = [...ungroupedUsers];

    while (group.length < 7 && tempUsers.length > 0) {
      const user = tempUsers.shift();
      const userId = user.author.toString();

      // Ensure the user hasn't been grouped with the same members before
      const hasConflict = group.some((g) =>
        previousGroups.get(userId)?.has(g.groupId)
      );

      if (!hasConflict || ungroupedUsers.length < 7) {
        group.push(user);
      } else {
        tempUsers.push(user);
      }
    }

    // Assign the same groupId to all users in the group
    for (const user of group) {
      user.groupId = groupId;
      await user.save();
      ungroupedUsers.splice(ungroupedUsers.indexOf(user), 1);
    }

    groups.push(group);
    groupId++;
  }

  return { message: "Groups assigned successfully", groups };
};
