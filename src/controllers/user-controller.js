import HttpStatus from "http-status";
import repositories from "../repositories";
import models from "../models";
import { error } from "winston";
import { use } from "passport";
import object from "joi/lib/types/object";
import { keys } from "lodash";

const { accountRepository, userRepository } = repositories;

var userRepoObjs = {};

export default {
  async at12AM() {
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
      let uid = req.user.id;
      if (userRepoObjs[uid]) {
        console.log("User Repo Obj OLD Dashboard", uid);
        res.status(HttpStatus.OK).json({
          success: true,
          data: await userRepoObjs[uid].data,
        });
        return true;
      }
      let result = await userRepository.dashboard(req);
      console.log("New ", result.userId);
      if (!(typeof result === 'UserPortfolioRepository')) {
        userRepoObjs[result.userId] = result;
        // // console.log("User Repo Obj ", userRepoObjs[result.userId].userId);
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
      // console.log(error);
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
      else{
        let data = await userRepoObjs[uid].getSchemeSummary(key);
        console.log("NEW Scheme Summary for ", uid, key);
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
    }
    else {
      let result = await userRepository.dashboard(req);
      console.log( result.userId , "New in schemesummary for scheme ", key );
      if (!(typeof result === 'UserPortfolioRepository')) {
        userRepoObjs[result.userId] = result;
        let data = await userRepoObjs[result.userId].getSchemeSummary(key);
        // // console.log("User Repo Obj ", userRepoObjs[result.userId].userId);
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
};