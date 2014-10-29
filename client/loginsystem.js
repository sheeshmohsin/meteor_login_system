if (Meteor.isClient) {
}

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/register', function () {
  if (Meteor.user()){
    this.redirect('/loggedin');
  }
  else {
    this.render('register', {to: 'aside'});
  }
});

Router.route('/', function(){
  if (Meteor.user()) {
    this.redirect('/loggedin');
  }
  else {
    this.render('login', {to: 'aside'});
  }
});

Router.route('/reset', function(){
  this.render('passwordrecovery',  {to:'aside'});
});

Router.route('/loggedin', function(){
  if (Meteor.user()){
    this.render('prof', {to:'aside'});
    console.log(Meteor.user());
  }
  else{
    this.redirect('/');
  }
});

Template.register.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#account-email').value
        , password = t.find('#account-password').value;

        // Trim and validate the input

      Accounts.createUser({email: email, password : password}, function(err){
          if (err) {
            // Inform the user that account creation failed
            alert("Account creation failed");
          } else {
            // Success. Account has been created and the user
            // has logged in successfully. 
            alert("Account created successfully and logged in");
            this.redirect('/loggedin');
          }

        });

      return false;
    }
  });

 Template.login.events({

    'submit #login-form' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = t.find('#login-email').value
        , password = t.find('#login-password').value;

        // Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, function(err){
        if (err)
          // The user might not have been found, or their passwword
          // could be incorrect. Inform the user that their
          // login attempt has failed. 
          alert("Login failed");
        else
          // The user has been logged in.
          alert("Login Successfull");
          this.redirect('/loggedin');
      });
         return false; 
      },
      'click #login' : function(e,t){
        Meteor.loginWithGithub({
        requestPermissions : ['user','public_repo']
        },function(err){
          if(err){
            alert(err);
          }
          else{
            //we will create players here ;) 
            alert("Success");
          }
        });
      }
  });

if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
  } 

Template.passwordrecovery.helpers({
    resetPassword : function(t) {
      return Session.get('resetPassword');
    }
});
 Template.passwordrecovery.events({

      'submit #recovery-form' : function(e, t) {
        e.preventDefault()
        var email = trimInput(t.find('#recovery-email').value)

        if (isNotEmpty(email) && isEmail(email)) {
          Session.set('loading', true);
          Accounts.forgotPassword({email: email}, function(err){
          if (err)
            Session.set('displayMessage', 'Password Reset Error &amp; Doh')
          else {
            Session.set('displayMessage', 'Email Sent &amp; Please check your email.')
          }
          Session.set('loading', false);
        });
        }
        return false; 
      },

      'submit #new-password' : function(e, t) {
        e.preventDefault();
        var pw = t.find('#new-password-password').value;
        if (isNotEmpty(pw) && isValidPassword(pw)) {
          Session.set('loading', true);
          Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
            if (err)
              Session.set('displayMessage', 'Password Reset Error &amp; Sorry');
            else {
              Session.set('resetPassword', null);
            }
            Session.set('loading', false);
          });
        }
      return false; 
      }
  });

Template.prof.events({
    'click .logout': function(e, t){
    e.preventDefault();
    Meteor.logout();
    this.redirect('/');
  }
});

Template.prof.helpers({
  email : function(){
    return Meteor.user().emails[0].address
  }
});


