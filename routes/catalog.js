var express = require('express');
var router = express.Router();
var xpath = require('xpath');
var constants = require('../constants');

var alma = require('../alma.js');

router.get('/', function(req, res, next) {
  res.render('catalog/index', 
    { title: 'Catalog' });  
});

router.get('/:mms_id', function(req, res, next) {
  alma.getp('/bibs/' + req.params.mms_id + '?view=brief')
  .then(data=>res.send(data))
  .catch(err=>sendErr(res,err));
});

router.post('/:mms_id', function(req, res, next) {
  alma.getXmlp('/bibs/'+req.params.mms_id)
  .then(doc=>{
    xpath.select(constants.XPATH_AUTHOR, doc)[0]
      .firstChild.data=req.body.author;
    xpath.select(constants.XPATH_TITLE, doc)[0]
      .firstChild.data=req.body.title;
    return alma.putXmlp('/bibs/'+req.params.mms_id+'?'+constants.UPDATE_BIB_QS,
      doc);    
  })
  .then(doc=>{
    var warnings = xpath.select(constants.XPATH_WARNINGS, doc)
      .map(x=>x.firstChild.data);            
    res.send({messages: { 
      success: "BIB updated successfully.", 
      warnings: warnings }
    });
  })
  .catch(err=>sendErr(res,err));
})

function sendErr(res,err) {
  res.status(400).json({messages: { error: err.message }});
}

module.exports = router;
