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