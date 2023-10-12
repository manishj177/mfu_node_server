import HttpStatus from "http-status";
import repositories from "../repositories";
import models from "../models";
import { error } from "winston";
import { use } from "passport";
import object from "joi/lib/types/object";
import { keys } from "lodash";

const { accountRepository, userRepository } = repositories;

// class UserDashboardService {
//   userPortfolioRepository= {};
//   constructor() {

//   }
//   appendDashboard(userRepoObj,next){
//     this.userPortfolioRepository[userRepoObj.userID]= userRepoObj;
//     return true;
//   }
//   async getDashboard(userID){
//     let result = this.userPortfolioRepository[userID];
//     console.log("Result ", result);
//     if(result){
//       return result.getPortfolioDashboardData();
//     }else{
//       return null;
//     }
//   }
//   getUserIDS(){
//     try{
//       return Object.keys(this.userPortfolioRepository).map((key)=>{return key;});
//     }
//     catch(e){
//       console.log(e);
//     }
//       return result;
//   }
//   async handleDetails(userID){
//     let result = await this.getDashboard(userID);
//     if(result){

//     }else{
//       let userRepoObj = new UserDashboardRepository(userID);
//       await this.appendDashboard(userRepoObj);
//       return userRepoObj;
//     }
//   }
// }

// const userDashboardService = Object.freeze(new UserDashboardService());

let userRepoObjs = {};
// if time is 12 am then clear the userRepoObjs


export default {
  async at12AM() {
    // let date = new Date();
      console.log("Clearing User Repo Obj");
      userRepoObjs = {};
      return "Reset User Repo Obj";
    return true;
  },
  /**
   * User signup
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async dashboard(req, res, next) {

    try {
      // await check12AM();
      if (userRepoObjs[req.user.id]) {
        console.log("User Repo Obj OLD Dashboard", req.user.id);
        res.status(HttpStatus.OK).json({
          success: true,
          data: await userRepoObjs[req.user.id].getLatestDashboardData(),
        });
        return true;
      }
      let result = await userRepository.dashboard(req);
      console.log("New ", result.userId);
      if (!(typeof result === 'UserPortfolioRepository')) {
        userRepoObjs[result.userId] = result;
        // console.log("User Repo Obj ", userRepoObjs[result.userId].userId);
        res.status(HttpStatus.OK).json({
          success: true,
          data: await result.getLatestDashboardData(),
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: result,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  async getSchemeSummary(req, res, next) {
    // await check12AM();
    let uid = req.user.id;
    let key = req.user['fund'] + '_' + req.user['scheme'];
    console.log("User Repo Obj ", uid, key);
    if (userRepoObjs[uid]) {
      if (userRepoObjs[uid].schemeSummary[key]) {
        console.log("OLD Scheme Summary", uid, key);
        res.status(HttpStatus.OK).json({
          success: true,
          fundData: {
            length: userRepoObjs[uid].schemeSummary[key].length,
            data: userRepoObjs[uid].schemeSummary[key]
          }
        });
        return true;
      }
      else if (userRepoObjs[uid].schemeSummary[key] == null) {
        let data = await userRepoObjs[uid].getSchemeSummary(key);
        console.log("NEW");
        data==true ? res.status(HttpStatus.OK).json({
          success: true,
          fundData: {
            length: userRepoObjs[uid].schemeSummary[key].length,
            data: userRepoObjs[uid].schemeSummary[key]
          }
        }) :
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: "redirect to dashboard",
          });
        return true;
      }
      else {
        let result = await userRepository.dashboard(req);
        console.log("New in schemesummary", result.userId);
        if (!(typeof result === 'UserPortfolioRepository')) {
          userRepoObjs[result.userId] = result;
          let data = await userRepoObjs[result.userId].getSchemeSummary(key);
          // console.log("User Repo Obj ", userRepoObjs[result.userId].userId);
          data==true?res.status(HttpStatus.OK).json({
            success: true,
          fundData: {
            length: userRepoObjs[uid].schemeSummary[key].length,
            data: userRepoObjs[uid].schemeSummary[key]
          }
          }):
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: "Go back and try again",
          });
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: "Go back and try again",
          });
        }

        return true;
      }
    }
  }
};