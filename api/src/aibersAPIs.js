const aibers = require('../package.json');

const aibers_info = async(req, res) => {
    try {
          res.json({
            "name": aibers.name,
            "version": aibers.version
          });
    } catch (err) {
      console.error(err.message);
    }
  } 

module.exports = {
    aibers_info,
}