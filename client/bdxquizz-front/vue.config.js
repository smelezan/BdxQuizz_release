const devServer = process.env.BACK_ADDRESS
  ? { proxy: 'http://backend:4000' }
  : { proxy: 'http://localhost:4000' };

module.exports = {
  devServer,
};
