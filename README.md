# Simple Node Example for Alma APIs

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Introduction
------------
This repository provides a small simple example of using the [Alma APIs](https://developers.exlibrisgroup.com/alma/apis) in a [Node.js](https://nodejs.org/) app.

About the App
-------------
The application demonstrates the following functionality:
* Scan in an item and return the item information (uses the configuration and BIB APIs)

More detailed information about this sample is available in this [blog post](https://developers.exlibrisgroup.com/blog/Using-the-Alma-APIs-with-Node). As with all demo applications, we include the following disclaimer: in an effort to increase readability and clarity, only minimal error handling has been added.

Installation Instructions
-------------------------
On any machine with [Node.js](https://nodejs.org) and [Git](http://git-scm.com/) installed, do the following:

1. Clone this repository: `git clone https://github.com/jweisman/simple-node-alma-apis.git`
2. Install dependencies: `npm install`
3. Copy the `config-example.json` file to `config.json` and replace the placeholder values:
  * `ALMA_HOST` and `ALMA_PATH` from the [Alma API Getting Started Guide](https://developers.exlibrisgroup.com/alma/apis)
  * `API_KEY` from the [Ex Libris Developer Network](https://developers.exlibrisgroup.com/) dashboard
4. Run the application: `npm start`

License
-------
The code for this application is made available under the [MIT license](http://opensource.org/licenses/MIT).
