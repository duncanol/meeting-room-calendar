Meteor.startup(function () {
    
    // code to run on server at startup
    console.log("The server is ready!");
});

//publish our "Assets" event - published every time variables inside the anonymous function are changed
Meteor.publish("Assets", function() {
    // just return the name field
    return assets.find({},{fields:{name: 1}});
});

// return the fields we need around bookings
Meteor.publish("Bookings", function(currentDay) {
    var nextDay = new Date(currentDay.getTime() + (24 * 60 * 60 * 1000));
    return bookings.find({from: {$gte: currentDay, $lt: nextDay}},{fields:{assetId: 1, userId: 1, from: 1, to: 1}});
});

// only expose the barest user details to the client
Meteor.publish("Users", function() {
    return Meteor.users.find({},{fields:{username: 1}});
});