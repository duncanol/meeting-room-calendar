//
// The intro Template
//
// templates are converted to javascript functions under the Templates namespace
Template.intro.showIntro = function() {
    return Session.equals("showIntro", true);
};

// a table of event handlers for the "intro" template
Template.intro.events({
    'click #show-intro-toggle': function() {
        if (Template.intro.showIntro()) {
            Session.set('showIntro', false);
        } else {
            Session.set('showIntro', true);
        }
    }
});