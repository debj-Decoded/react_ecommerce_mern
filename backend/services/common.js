const passport=require('passport')

exports.isAuth=(req, res, done)=> {
     return passport.authenticate('jwt')
  }

exports.sanitizeUser=(user)=>{
    return { id: user.id, name: user.name, email: user.email, role: user.role }
  }

exports.cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    // token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjUxYTQwMWM1NDkzZTI4MWNkYTVjMyIsIm5hbWUiOiJhZG1pbiBhZG1pbiIsImVtYWlsIjoiYWRtaW5AY29jb21lbG9uLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNjM2NzU1Mn0.L8BZ1HLoYvDQ2zkFYCTC79NYCdpt9eTHqVMnfe9DiKU"
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjJhOTM3ZWJlMmNkN2VkZDMxYzYzMCIsIm5hbWUiOiJhbmtpdGEiLCJlbWFpbCI6Im1pbm1pdGFAY29jb21lbG9uLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA2MjA3NTQzfQ.lrOswLtTj9sbLrAeenUgev7uQjiMd-9S27uj52bsLa8"
    return token;
};
// opts.jwtFromRequest = cookieExtractor;