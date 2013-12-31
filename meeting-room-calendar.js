if (Meteor.isClient) {
    console.log("The client is ready!");
    
    // templates are converted to javascript functions under the Templates namespace
    Template.intro.showIntro = function() {
        return Session.equals("showIntro", true);
    };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
      console.log("The server is ready!");
  });
}
