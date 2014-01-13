console.log("The client is ready!");

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Handlebars.registerHelper('adminUser', function() {
    return adminUser(Meteor.userId());
});

CalendarFunctions = {
    formatTime: function(date) {
       return date.toTimeString().substring(0, 5);
    }
};

MeetingRooms = {
    assets: function() {
        return assets.find({});
    }
};

//subscribe to changes in assets list - this is the local cache version of the server's collection
// and only holds the data that we were happy to expose
Meteor.subscribe("Assets");

//subscribe to changes in bookings
Meteor.autosubscribe(function() {
    Meteor.subscribe("Bookings", Session.get('currentDay'));
});

//subscribe to changes in users
Meteor.subscribe("Users");