# Meteor Relay Chat (MRC)

This project is in beta! Please consider helping to bring it to reality faster..

Meteor Relay Chat (MRC) is a Meteor chat implementation modeled after IRC.  This is a complete solution and is customizable but not intended as an embedded solution in to an existing site.

# Installation

1. Create a new meteor project and go to it via `meteor create projectName | cd projectName`
2. Add the MRC package via `meteor add alisalaah:mrc`
3. Remove autopublish and insecure packages `meteor remove autopublish insecure`
4. Add your desired account services `meteor add accounts-password accounts-facebook` (accounts-meld only works between facebook, google and github)
5. Optionally add Kadira for performance monitoring `meteor add meteorhacks:kadira`
6. Add `{{> mrc}}` within your body tags
7. Create a settings.json (see instructions below)
8. Start your application using the json `meteor --settings settings.json`

* Note: MRC is intended for a blank Meteor application.  See the Demo for a functional example.

# Example

Demo: http://mrc.meteor.com

* Note: The code for the demo is inside this github under the `demo` folder.

# Settings.json

Example: https://github.com/alisalaah/meteor-mrc/blob/master/demo/settings.json

The above is an example of the settings json.  You would remove (or add) for any login services you have.  If not using Kadira remove that.  Add analytics or remove them.  The `owner` should be the email that associates with your Facebook, Google or Github account so that once you login the first time using those auth services you will automatically be made owner.  If you are not using one of those 3 services you will have to manually claim ownership after signing in for the first time - and you will NOT use this field (delete it).  To manually claim ownership login to the site and then open the JavaScript console and type `claimOwner()` and hit enter.  If there is no owner for the site yet you will become the owner with your current logged in account.  This is first come first serve so make sure you do this before anyone else.  You can always manually change this via mongo console but all in site permissions will protect the owner from being removed or changed for security.

# Usage

MRC is highly configurable through built in settings.  Default settings make it ready to go but pre-deployment settings can be set via your projects JavaScript or declare some custom templates or styling as well.

This project is still in development and more will be written when it is made available.

# Contribute

If you wish to help please contact me via Meteor's IRC, Forums or @alicamarata

# Version History

## 0.2.2

- Startup procedure with settings.json
- Analytics and Kadira implemented
- Start mod controls like banning

## 0.2.1

- Restructure
- Use of roles package
- Signup procedure
- Extra permissions and hooks on collections

## 0.2

- Basic functionality
- Admin area
- Edit profile area (in progress)

## 0.1

- Initial version and start of code