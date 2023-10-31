import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import models from "../models";
import config from "../config";
import jwt from "../services/jwt";
import httpStatus from "http-status";
import { post } from "request";
import { Pool } from 'pg';
const { Sequelize } = models.sequelize;
// const { pool } = models.pool;
// // console.log('pool in authrepo', models.pool);

const { user, userToken, userCanRegistration, cdsHold } = models//, userCanRegistration
export default {
  async createHashPassword(password) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
    } catch (error) {
      throw Error(error);
    }
  },
  async signup(req, t) {
    try {
      let bodyData = req.body;
      let hashPassword = await this.createHashPassword(bodyData.password);
      bodyData.password = hashPassword;
      let isUserExist = await this.checksignup(req, t);
      if (isUserExist) {
        return "User already exists!!!";
      }

      let userData = await user.create(bodyData);
      let can=this.checkCan(userData.id);
      if (can!='No'){
        // const pool = new Pool({
        //   user: 'postgres',
        //   host: 'localhost',
        //   database: 'mafu29082023',
        //   password: 'sith1234',
        //   port: 5432,
        // });
        const client = await models.pool.connect();
        let result = await client.query(
          "update txn_response_transaction_rsps set user_id=$1 from user_can_registrations where user_can_registrations.first_holder_pan = $2 and txn_response_transaction_rsps.can_number = user_can_registrations.can;",
        [userData.id,userData.panCard]
        );
        let results = { 'results': (result) ? result.rows : null};
        // console.log('results',results);
        result = await client.query(
          "update txn_response_systematic_rsps set user_id=$1 from txn_response_transaction_rsps where txn_response_transaction_rsps.user_id = $1 and txn_response_systematic_rsps.folio_number in (select txn_response_transaction_rsps.folio_number from txn_response_transaction_rsps where txn_response_transaction_rsps.user_id = $1 group by txn_response_transaction_rsps.folio_number))",
        [userData.id]
        );
        results = { 'results': (result) ? result.rows : null};
        // console.log('results',results);
        client.release();
      }
      if (userData) {
        return userData;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },
  // //i want to check if user is already registered or not with devicetoken
  async checksignup(req, t) {
    try {
      // let userData = await user.findOne({ where: { email: req.body.email } });
      let client = await models.pool.connect();
      let query = `SELECT * FROM users WHERE email ilike '%${req.body.email}%'`;
      // console.log('query', query);
      let result = await client.query(query);
      // // console.log('result', result.rows[0]);
      // query = `SELECT * FROM users WHERE pan_card ilike '%${req.body.panCard}%'`;
      // // console.log('query', query);
      // result = await client.query(query);
      // // // console.log('result', result.rows[0]);
      const userData = result.rows[0];
      client.release();
      if (userData) {
        return { success: true, data: userData };
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },

  async checkCan(userID,t) {
    try {
      let client = await models.pool.connect();
      let query = `SELECT * FROM users WHERE id = ${userID};`;
      // // console.log('query', query);
      let result = await client.query(query);
      // // console.log('result', result.rows[0]);
      const userData = result.rows[0];
      // // console.log('userData', userData);
      let userRegData = await client.query(`SELECT * FROM user_can_registrations WHERE first_holder_pan ilike '%${userData.pan_card}%'`);
      // // console.log('userRegData', userRegData);
      client.release();
      if (userRegData.rowCount>0) {
        return userRegData.rows[0].can;
      } else {
        return 'No';
      }
    } catch (error) {
      return 'No';
    }
  },

  async checkCanConsent(can,t) {
    try {
      let client = await models.pool.connect();
      let query = `SELECT * FROM cds_holds WHERE can = '${can}';`;
      // // console.log('query', query);
      let results = await client.query(query);
      // console.log('results', results.rows[0]);
      const consent = results.rows[0];
      // console.log('consent', consent);
      if (consent) {
        return 'Yes';
      } else {
        return 'No';
      }
    } catch (error) {
      return 'No';
    }
  },

  async checkCanAppliedConsent(req,res,  t) {
    try {
      let login=post('https://www.mfuonline.com/MfUtilityApiLogin.do?sendResponseFormat=JSON&loginid=MANISHSAPI9&password=x4xI1WG0aALd5uoQTLF8aw&entityId=40071D&logTp=A&versionNo=2.00');
      // console.log('login',login);
      let applictaion="https://www.mfuonline.com/ConsentAPIEntryAction.do?sendResponseFormat=JSON&sessioncontext=$login.sessioncontext&sendersubid=login.sendersubid&logTp=A&can=req.can&pan=req.pan&mobNo=req.mobileNO&noOfRec=4&dataSetKey=MF&dataSetKey=CD&dataSetKey=PD&dataSetKey=HD"
      // let can = await userCanRegistration.findOne({ where: { firstHolderPan: userData.panCard } });
      // let consent = await cdsHold.findOne({ where: { can: this.can,  } });

      // if (consent) {
      //   return {success:true};
      // } else {
      //   return false;
      // }
    } catch (error) {
      throw Error(error);
    }
  },

  async compareUserPassword(password, hashPassword) {

    try {
      if (password && hashPassword) {
        const isPasswordMatch = await bcrypt.compare(password, hashPassword);
        if (isPasswordMatch) {
          return true;
        }
      }
      // return false;
    } catch (error) {
      next(error)
    }
  },

  async checkUserAccountLogin(req, res, next) {

    try {
      let { email, password, deviceType } = req.body;
      let query = `SELECT * FROM users WHERE email='${email}'`;
      // // console.log('query', query);
      let client = await models.pool.connect();
      let result = await client.query(query);
      // console.log('result', result.rows[0]);
      const userDetail = result.rows[0];
      client.release();
      // const userDetail = await user.findOne({ where: { email: req.body.email } });
      if (userDetail) {
        const isPasswordMatch = await this.compareUserPassword(password, userDetail.password);
        if (!isPasswordMatch) {
          print('incorrect PASSWORD');
          return  {
            success: true,
            data: 'incorrect PASSWORD'
          };
        }
        if (isPasswordMatch) {
          const { password, ...userData } = userDetail;
          const token = jwt.createToken(userData);
          let userAccessToken = await token.then(e => e);
          // console.log('userAccessToken', userAccessToken);
      
          const deviceData = {
            userId: userData.id,
            deviceType: deviceType,
            accessToken: userAccessToken
          };
          // console.log('deviceData', deviceData);
          await this.addUpdateUserDevice(deviceData);
          let can = await this.checkCan(userData.id);
          // // console.log('userData', userData);
          let consent = 'No';
          if ( can!='No'){
            // console.log('can', can);
            consent = await this.checkCanConsent(can);
          }
          const sessionDetail = {
            token: userAccessToken,
            token_expire_time: config.jwtExpireIn,
            can: can,
            consent: consent,
            userData: userData
          };
          // console.log('sessionDetail', sessionDetail);
          return sessionDetail;
        };
        return false;
      }
    } catch (error) {
      // console.log(error);
    }
  },
  
  /**
 * Find user detail
 * @param {Object} whereObj
 */
  async findOne(whereObj) {
    try {
      let query = `SELECT * FROM users WHERE email='${email}'`;
      // // console.log('query', query);
      let client = await models.pool.connect();
      let result = await client.query(query);
      // console.log('result', result.rows[0]);
      const userDetail = result.rows[0];
      client.release();
      return await user.findOne({
        where: whereObj,
        attributes: {
          exclude: ["password", "verifyToken"],
        },
      });
    } catch (error) {
      throw Error(error);
    }
  },

  /**
 * Add or update user device
 * @param {Object} data
 */
  async addUpdateUserDevice(data) {
    try {
      
      const userDeviceToken = await this.getUserDeviceToken(data.userId);

      const { userId, deviceType, accessToken } =
data;

      if (userDeviceToken) {
        const newData = {
          accessToken,
          deviceType,
        };
        await this.updateUserDevice(userDeviceToken, newData);
      } else {
        const updateData = {
          userId,
          deviceType,
          accessToken
        };
        await this.addUserDevice(updateData);
      }

    } catch (error) {
      throw Error(error);
    }
  },

  /**
 * Get user device token from user id
 * @param {Number} userId
 */
  async getUserDeviceToken(userId) {
    try {
      let query = `SELECT * FROM user_tokens WHERE user_id='${userId}' limit 1`;
      // // console.log('query', query);
      let client = await models.pool.connect();
      let result = await client.query(query);
      // console.log('result get', result.rows[0]);
      const userTokenData = result.rows[0];
      client.release();
      return userTokenData;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
* Update user device
* @param {Object} userDeviceObject
* @param {Object} data
*/
  async updateUserDevice(userDeviceObject, data) {
    try {
      let query = `update user_tokens set access_token='${data.accessToken}', device_type='${data.deviceType}' where user_id='${userDeviceObject.user_id}';`;
      // console.log('query', query);
      let client = await models.pool.connect();
      let result = await client.query(query);
      // console.log('result update', result.rowCount);
      const response = result.rowCount;
      client.release();
      // const response = await userDeviceObject.update(data);
      return response;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
 * Add user device
 * @param {Object} data
 */
  async addUserDevice(data) {
    try {
      let query = `insert into user_tokens (user_id, access_token, device_type) values ('${data.userId}', '${data.accessToken}', '${data.deviceType}');`;
      // // console.log('query', query);
      let client = await models.pool.connect();
      let result = await client.query(query);
      // console.log('result insert', result.rows[0]);
      const response = result.rows[0];
      return response;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
 * Get device etail by token
 * @param {String} token
 */
  async getDeviceDetailByToken(token) {
    try {
      const where = {
        access_token: token,
      };
      let query = `SELECT * FROM user_tokens WHERE access_token='${token}' limit 1`;
      // // console.log('query', query);
      let client = await models.pool.connect();
      let result = await client.query(query);
      // // console.log('result get', result.rows[0]);
      const userTokenData = result.rows[0];
      client.release();

      return userTokenData;
    } catch (error) {
      throw Error(error);
    }
  },
}
