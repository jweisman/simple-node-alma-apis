var nconf = require('nconf');

const XPATH_AUTHOR = '/bib/record/datafield[@tag="100"]/subfield[@code="a"]';
const XPATH_TITLE = '/bib/record/datafield[@tag="245"]/subfield[@code="a"]';
const XPATH_WARNINGS = '/bib/warnings/warning/message';
const UPDATE_BIB_QS = '&validate=true&cataloger_level=00&normalization=';

nconf.env()
   .file({ file: './config.json' });

module.exports = {
  XPATH_AUTHOR: XPATH_AUTHOR,
  XPATH_TITLE: XPATH_TITLE,
  XPATH_WARNINGS: XPATH_WARNINGS,
  UPDATE_BIB_QS: UPDATE_BIB_QS + nconf.get('NORMALIZATION_ID')  
}