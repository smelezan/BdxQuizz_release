const jwt = require('jsonwebtoken');

exports.isAuthentified = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_key');
    const { userId } = decodedToken;
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error('Invalid user ID');
    } else {
      next();
    }
  } catch {
    // console.log('UNOTAOTOIEO');
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};
