assets = new Meteor.Collection('assets');

adminUser = function(userId) {
    var adminUser = Meteor.users.findOne({
        username : "admin"
    });
    return (userId && adminUser && userId === adminUser._id);
};

adminUserLoggedIn = function() {
    return adminUser(Meteor.userId());
};

allowedToRemoveBooking = function(userId, booking) {
    return adminUser(userId) || booking.userId === userId;
};

assets.allow({
    insert: function (userId, doc) {
        return adminUserLoggedIn() && uniqueName(doc.name);
    },
    update: function (userId, doc, fields, modifier) {
        return adminUserLoggedIn() && uniqueName(modifier['$set'].name);
    },
    remove: function (userId, doc, fields, modifier) {
        return adminUserLoggedIn();
    }
});

var uniqueName = function(assetName) {
    return assets.find({name: assetName}).count() == 0;
};

bookings = new Meteor.Collection('bookings');

bookings.allow({
    insert: function (userId, doc) {
        return Meteor.userId() != null;
    },
    update: function (userId, doc, fields, modifier) {
        return Meteor.userId() != null;
    },
    remove: function (userId, doc, fields, modifier) {
        return allowedToRemoveBooking(userId, doc);
    }
});