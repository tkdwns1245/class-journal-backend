const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    ctx.body = {
      Message: 'do not have authority',
    }
    return;
  }
  return next();
};

export default checkLoggedIn;
