import HttpStatus from 'http-status';
import jwt from '../services/jwt';
import userRepository from '../repositories/user-repository';
// import accountRepository from '../repositories/account-repository';
import accountRepository from '../repositories/account-repository';
import models from '../models';
/**
  * Check user authorization
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  */
const authValidateRequest = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      // // console.log("Auth ", req.headers);
      const parts = req.headers.authorization.split(' ');
      // // console.log("Parts ", parts);
      if (parts.length == 2) {
        const scheme = parts[0];
        const token = parts[1];

        if (/^Bearer$/i.test(scheme)) {

          const decodedToken = jwt.verifyToken(token);
          if (decodedToken) {
            // // console.log("Decoded Token ", decodedToken);
            let user = await userRepository.findOne({ id: decodedToken.id });//Find user detail from token
            // // console.log("User ", user.id);
            if (user) {
              // // console.log("User ", user.id);
              const userToken = await accountRepository.getDeviceDetailByToken(token);
              // // console.log("User Token ", userToken);
              if (userToken) {
                // // console.log("User Token ", userToken);
                if(req.headers.fund && req.headers.scheme){
                  // // console.log("Fund ", req.headers.fund);
                  // // console.log("Scheme ", req.headers.scheme);

                  user.fund = req.headers.fund;
                  user.scheme = req.headers.scheme;
                  // console.log("User ", user.id, user.fund, user.scheme);
                }
                req.user = user;
                req.userToken = userToken;
                next();
              } else {
                const error = new Error('TOKEN_BAD_FORMAT');
                error.status = HttpStatus.UNAUTHORIZED;
                error.message = 'Your session has expired. Please login.'; // 'Format is Authorization: Bearer [token]';
                next(error);
              }
            } else {
              const error = new Error();
              error.status = HttpStatus.UNAUTHORIZED;
              error.message = 'Your Account is inactive, please contact to admin.';
              next(error);
            }

          } else {
            const error = new Error('TOKEN_NOT_FOUND');
            error.status = HttpStatus.BAD_REQUEST;
            error.message = 'Unauthorized access or token required.';
            next(error);
          }
        } else {
          const error = new Error('TOKEN_BAD_FORMAT');
          error.status = HttpStatus.UNAUTHORIZED;
          error.message = 'Your session has expired. Please login.'; // 'Format is Authorization: Bearer [token]';
          next(error);
        }
      } else {
        const error = new Error('TOKEN_BAD_FORMAT');
        error.status = HttpStatus.UNAUTHORIZED; // HttpStatus['401'];
        error.message = 'Unauthorized user access.'; // 'Format is Authorization: Bearer [token]';
        next(error);
      }
    } else {
      const error = new Error('TOKEN_NOT_FOUND');
      error.status = HttpStatus.BAD_REQUEST;
      error.message = 'Unauthorized access or token required.';
      next(error);
    }
  } catch (error) {
    error.status = HttpStatus.UNAUTHORIZED;
    next(error);
  }
};
export default authValidateRequest;
