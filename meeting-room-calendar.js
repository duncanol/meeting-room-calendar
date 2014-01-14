if (Meteor.isClient) {
    
    Meteor.startup(function () {
        var fragment = Meteor.render(function () {
          return "<span>Here it is: " + Session.get("myMessage") + "</span>";
        });
        
        var fragment2 = Meteor.render(function () {
          return "<span>Here it is again: " + Session.get("myMessage") + "</span>";
        });
        
        // append to multiple places
        document.getElementById('my-message-placeholder').appendChild(fragment);
        document.getElementById('another-message-placeholder').appendChild(fragment2);
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
