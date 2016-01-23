/* @file RegistrationPanel.react.js
 * @brief Create the RegistrationPanel React component.
 *
 * @author Oscar Bezi (bezi@scottylabs)
 */
'use strict';

var React = require('react');

var {Button} = require('react-bootstrap');
var LoginButton = require('./LoginButton.react');

var UserStatusStore = require('../stores/UserStatusStore');

var api = require('../api/status');

class RegistrationPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'loggedIn': false,
      'status': '',
      'registration_data': {},
    };

    this.updateAuth = this.updateAuth.bind(this);

    this.reloadTimer = -1;
  }

  componentWillMount() {
    UserStatusStore.register(this.updateAuth);
    this.updateAuth();
  }

  componentWillUnmount() {
    UserStatusStore.deregister(this.updateAuth);
  }

  /* @brief Gets auth state from the UserStatusStore. */
  updateAuth() {
    this.setState({
      'loggedIn': UserStatusStore.get().loggedIn,
      'status': UserStatusStore.get().status,
    });

    if (UserStatusStore.get().status === 'ADMIN') {
      var reload_stuff = () => {
        return api.get_registration_status().then((data) => {
          this.setState({
            'registration_data': data,
          })
        });
      };

      if (this.reloadTimer === -1) {
        this.reloadTimer = setInterval(reload_stuff, 100);
      }
    } else {
      if (this.reloadTimer !== -1) {
        clearInterval(reloadTimer);
        this.reloadTimer = -1;
      }
    }
  }

  render() {
    var body;
    if (!this.state.loggedIn) {
      body = (
        <div>
          <p>{'Log in to register for TartanHacks!'}</p>
        </div>
      )
    } else {
      switch(this.state.status) {
        case 'UNREGISTERED': {
          body = (
            <div className={this.state.status}>
              <p>{'You\'re logged in! Register as a hacker, or become a mentor for a guaranteed spot (and some extra swag!)'}</p>
              <Button className="nice-btn" onClick={api.become_mentor}>Become a mentor.</Button>
              <br />
              <Button className="nice-btn" onClick={api.register}>Register as a hacker.</Button>
            </div>
          );
          break;
        }
        case 'ADMIN': {
          body = (
            <div className={this.state.status}>
              <p>{'You\'re an admin, silly.'}</p>
              <pre>{JSON.stringify(this.state.registration_data)}</pre>
              <script src="https://app.box.com/embed/upload.js?token=2bhk7deq99xtb92sryx002ahv92g1a9d&folder_id=6229265697&w=385&h=250&i=&d=0&t=Tartanhacks%20Resume%20Drop&r=1" type="text/javascript"></script>
            </div>
          );
          break;
        }
        case 'MENTOR': {
          body = (
            <div className={this.state.status}>
              <p>{'Thanks so much for registering to be a mentor! We\'ll reach out to you over email soon.'}</p>
              <Button className="nice-btn" onClick={api.revert_status}>Stop Being a Mentor</Button>
            </div>
          );
          break;
        }
        case 'HACKER_CHECKED_IN': {
          body = (
            <div className={this.state.status}>
              <p>{'You\'re checked in. Time to get hacking!'}</p>
              <Button className="nice-btn" onClick={api.revert_status}>Give Up Your Spot</Button>
            </div>
          );
          break;
        }
        case 'HACKER_ACCEPTED': {
          body = (
            <div className={this.state.status}>
              <p>{'Congrats! You\'re in. Make sure to check in by 5:30PM on hack day. See you February 5th!'}</p>
              <Button className="nice-btn" onClick={api.revert_status}>Give Up Your Spot</Button>
            </div>
          );
          break;
        }
        case 'HACKER_WAITLISTED': {
          body = (
            <div className={this.state.status}>
              <p>{'Thank you for registering! Unfortunately, due to overwhelming demand, we\'re unable to guarantee you a spot. Don\'t worry though - be at Porter 100 by 5:30 PM and we\'ll do our best to accommodate you.'}</p>
              <Button className="nice-btn" onClick={api.revert_status}>Give Up Your Spot</Button>
            </div>
          );
          break;
        }
      }
    }

    return (
      <div className="RegistrationPanel" >
        <h2>Register</h2>
        {body}
        <LoginButton />
      </div>
           );
  }
}

module.exports = RegistrationPanel;
