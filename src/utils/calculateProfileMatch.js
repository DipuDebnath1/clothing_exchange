
  // Function to calculate profile match percentage
  const calculateProfileMatch = (userProfile, bookedUserProfile) => {
    let matchCount = 0;

    // Compare relevant fields, e.g., movieCategory, relationStatus, etc.
    if (userProfile.movieCategory === bookedUserProfile.movieCategory)
      matchCount++;
    if (userProfile.relationStatus === bookedUserProfile.relationStatus)
      matchCount++;
    if (userProfile.haveChildren === bookedUserProfile.haveChildren)
      matchCount++;
    if (
      userProfile.videoGamsWithOnlineFriends ===
      bookedUserProfile.videoGamsWithOnlineFriends
    )
      matchCount++;
    if (
      userProfile.movieNightWithFriends ===
      bookedUserProfile.movieNightWithFriends
    )
      matchCount++;
    if (
      userProfile.seeingMovieTheaters === bookedUserProfile.seeingMovieTheaters
    )
      matchCount++;
    if (userProfile.nightBarTown === bookedUserProfile.nightBarTown)
      matchCount++;
    if (userProfile.playingSports === bookedUserProfile.playingSports)
      matchCount++;
    if (userProfile.relaxed === bookedUserProfile.relaxed) matchCount++;
    if (userProfile.introverted === bookedUserProfile.introverted) matchCount++;

    // Calculate match percentage based on the number of fields
    const totalFields = 10; // Number of fields to compare
    const matchPercentage = (matchCount / totalFields) * 100;
    return matchPercentage;
  };

module.exports = calculateProfileMatch