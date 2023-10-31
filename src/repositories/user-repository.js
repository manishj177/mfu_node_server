import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import models from "../models";
import config from "../config";
import jwt from "../services/jwt";
import httpStatus from "http-status";
import { intersection, sum } from "lodash";
import { push } from "joi/lib/ref";
import x from "uniqid";
import https from "https";
var xirr = require('xirr');
import { irr } from "node-irr";
// import "../helpers/commonHelper.js";
//want to import function from commonHelper.js
import commonHelper from "../helpers/commonHelper.js";

import { parse } from "dotenv";
import { and } from "joi/lib/types/object";
//import schemeCodes from "../utils/schemes.json";
import { match } from "assert";
import e from "express";
import { all } from "async";
const { Sequelize } = models.sequelize;
const { user, txnResponseSystematicRsp, txnResponseTransactionRsp, userCanRegistration } = models
const matchSchemes = {
  'SBI Flexi Cap Fund Regular Plan - Growth': ['SBI Flexicap Fund - REGULAR PLAN -Growth Option', 103215],
  'Aditya Birla Sun Life Digital India Fund - Growth-Regular Plan': ['Aditya Birla Sun Life Digital India Fund - Growth - Regular Plan', 103168],
  'Axis Mid Cap Fund - Growth': ['Axis Midcap Fund - Growth', 114564],
  'NAVI FLEXI CAP FUND REGULAR PLAN GROWTH': ['Navi Flexi Cap Fund - Regular Plan - Growth', 143787],
  'Axis Long Term Equity Fund - Growth': ['Axis Long Term Equity Fund - Growth', 112323],
  'Mirae Asset Tax Saver Fund - Regular Growth': ['Mirae Asset Tax Saver Fund-Regular Plan-Growth', 135784],
  'ICICI Prudential Flexicap Fund Growth': ['ICICI Prudential Flexicap Fund - Growth', 148989],
  'SUNDARAM SELECT FOCUS REGULAR PLAN GROWTH': ['Sundaram Select Focus Regular Plan - Growth', 101537],
  'SBI LONG TERM EQUITY FUND- REGULAR PLAN - GROWTH': ['SBI LONG TERM EQUITY FUND - REGULAR PLAN- GROWTH', 105628],
  'Nippon India SMALL CAP FUND - GROWTH PLAN GROWTH OPTION': ['Nippon India Small Cap Fund - Growth Plan - Growth Option', 113177],
  'ICICI Prudential PSU Equity Fund - Growth': ['ICICI Prudential PSU Equity Fund - Growth', 150538],
  'Mirae Asset Midcap Fund - Regular Plan Growth': ['Mirae Asset Midcap Fund - Regular Plan-Growth Option', 147479],
  'ICICI Prudential ESG Fund Growth': ['ICICI Prudential ESG FUND - Growth', 148517],
  'Canara Robeco Flexi Cap Fund Regular Growth': ['Canara Robeco Flexi Cap Fund - Regular Plan - Growth', 101922],
  'SBI Savings Fund-Regular-Growth': ['SBI  SAVINGS FUND - REGULAR PLAN - GROWTH', 102503],
  'Invesco India Largecap Fund - Growth': ['Invesco India Largecap Fund - Growth', 112098],
  'Parag Parikh Flexi Cap Fund-Regular-Growth': ['Parag Parikh Flexi Cap Fund - Regular Plan - Growth', 122640],
  'Aditya Birla Sun Life Pharma & Healthcare Fund Regular Growth': ['Aditya Birla Sun Life Pharma and Healthcare Fund-Regular-Growth', 147407],
  'SUNDARAM LARGE CAP FUND (FORMERLY KNOWN AS SUNDARAM BLUECHIP FUND) - REGULAR GROWTH': ['Sundaram Large Cap Fund(Formerly Known as Sundaram Blue Chip Fund) Regular Plan - Growth', 148504],
  'Aditya Birla Sun Life Special Opportunities Fund Regular Growth': ['Aditya Birla Sun Life Special Opportunities Fund-Regular Plan-Growth', 148537],
  'SBI MultiCap Fund - Regular Plan - Growth': ['SBI Multicap Fund- Regular Plan- Growth Option', 149886],
  'ICICI PRUDENTIAL ASSET ALLOCATOR FUND (FOF) - GROWTH': ['ICICI Prudential Asset Allocator Fund (FOF) - Growth', 102137],
  'Franklin India TAXSHIELD-GROWTH': ['Franklin India Taxshield-Growth', 100526],
  'HDFC TaxSaver - Growth': ['HDFC TaxSaver-Growth Plan', 101979],
  'Nippon India TAX SAVER (ELSS) FUND - GROWTH PLAN - GROWTH OPTION': ['Nippon India Tax Saver (ELSS) Fund-Growth Plan-Growth Option', 103196],
  'Kotak Tax Saver Scheme - Growth': ['Kotak Tax Saver-Scheme-Growth', 103339],
  'SBI Contra Fund - Regular Plan - Growth': ['SBI CONTRA FUND - REGULAR PLAN -GROWTH', 102414],
  'Invesco India Tax Plan - Growth': ['Invesco India Tax Plan - Growth', 104636],
  'SBI Equity Hybrid Fund - Regular Plan - Growth': ['SBI EQUITY HYBRID FUND - REGULAR PLAN -Growth', 102885],
  'Aditya Birla Sun Life Flexi Cap Fund - Growth-Regular Plan': ['Aditya Birla Sun Life Flexi Cap Fund - Growth - Regular Plan', 103166],
  'DSP Equity & Bond Fund-Regular-Growth': ['DSP Equity & Bond Fund- Regular Plan - Growth', 100081],
  'HDFC Hybrid Equity Fund - Growth': ['HDFC Hybrid Equity Fund - Growth Plan', 102948],
  'Axis Focused 25 Fund GROWTH': ['Axis Focused 25 Fund - Growth Option', 117560],
  'SBI Dividend Yield Fund - Regular Plan - Growth': ['SBI Dividend Yield Fund - Regular Plan - Growth', 151476],
  'Mirae Asset Emerging Bluechip Fund - Regular Plan Growth': ['Mirae Asset Emerging Bluechip Fund - Regular Plan - Growth Option', 112932],
  'SUNDARAM MID CAP FUND REGULAR GROWTH': ['Sundaram Mid Cap Fund Regular Plan - Growth', 101539],
  'SBI Large & Midcap Fund-Regular-Growth': ['SBI LARGE & MIDCAP FUND- REGULAR PLAN -Growth', 103024],
  'Axis Bluechip Fund - Growth': ['Axis Bluechip Fund - Growth', 112277],
  'Kotak Equity Opportunities Fund - Growth': ['Kotak Equity Opportunities Fund - Growth', 103234],
  'Aditya Birla Sun Life Multi-Cap Fund Regular Growth': ['Aditya Birla Sun Life Multi-Cap Fund-Regular Growth', 148918],
  'ICICI Prudential Business Cycle Fund Growth': ['ICICI Prudential Business Cycle Fund Growth', 148653],
  'ICICI Prudential Transportation and Logistics Fund - Growth': ['ICICI PRUDENTIAL TRANSPORTATION AND LOGISTICS FUND - Growth', 150684],
  'DSP Small Cap Fund-Regular-Growth': ['DSP Small Cap Fund - Regular - Growth', 105989],
  'Aditya Birla Sun Life ESG Fund Regular Growth': ['Aditya Birla Sun Life ESG Fund-Regular Plan-Growth', 148635],
  'MOTILAL OSWAL FLEXI CAP FUND-Regular Growth': ['Motilal Oswal Flexi Cap Fund Regular Plan-Growth Option', 129048],
  'Tata Digital India Fund Regular Plan Growth': ['Tata Digital India Fund-Regular Plan-Growth', 135797],
  'Invesco India Midcap Fund - Growth': ['Invesco India Midcap Fund - Growth Option', 105503],
  'Invesco India Growth Opportunities Fund- Growth': ['Invesco India Growth Opportunities Fund - Growth', 106144],
  'ICICI Prudential Short Term Fund - Growth Option': ['ICICI Prudential Short Term Fund - Growth Option', 101758],
  'SBI Liquid Fund - Regular Plan - Growth': ['SBI Liquid Fund - REGULAR PLAN -Growth', 105280],
  'SBI Technology Opportunities Fund - Regular Plan - Growth': ['SBI TECHNOLOGY OPPORTUNITIES FUND - REGULAR PLAN - GROWTH', 120577],
  'Nippon India GROWTH FUND - GROWTH PLAN GROWTH OPTION': ['Nippon India Growth Fund-Growth Plan-Growth Option', 100377],
  'Invesco India PSU Equity Fund - Growth': ['Invesco India PSU Equity Fund - Growth', 112171],
  'SBI Balanced Advantage Fund - Regular Growth': ['SBI Balanced Advantage Fund - Regular Plan - Growth', 149132],
  'SBI Small Cap Fund-Regular-Growth': ['SBI Small Cap Fund - Regular Plan - Growth', 125494],
  'Aditya Birla Sun Life Asset Allocator FoF Regular Growth': ['Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Growth Option', 131864],
  'SBI Corporate Bond Fund - Regular Plan Growth': ['SBI Corporate Bond Fund - Regular Plan - Growth', 146207],
  'Nippon India Ultra Short Duration Fund - GROWTH OPTION': ['Nippon India Ultra Short Duration Fund- Growth Option', 143493],
  'SBI Blue Chip Fund - Regular Plan - Growth': ['SBI BLUE CHIP FUND-REGULAR PLAN GROWTH', 103504],
  'Aditya Birla Sun Life PSU Equity Fund Regular-Growth': ['Aditya Birla Sun Life PSU Equity Fund-Regular Plan-Growth', 147846],
  'Aditya Birla Sun Life Business Cycle Fund Regular Growth': ['Aditya Birla Sun Life Business Cycle Fund-Regular-Growth', 149296],
  'Nippon India Focused Equity Fund- GROWTH PLAN GROWTH OPTION': ['Nippon India Focused Equity Fund -Growth Plan -Growth Option', 104637],
  'Invesco India Contra Fund - Growth': ['Invesco India Contra Fund - Growth', 105460],
  'HDFC Mid-Cap Opportunities Fund - Growth': ['HDFC Mid-Cap Opportunities Fund - Growth Plan', 105758],
  'SBI Multi Asset Allocation Fund - Regular Plan - Growth': ['SBI MULTI ASSET ALLOCATION FUND - REGULAR PLAN - GROWTH', 103408],
  'ICICI Prudential Housing Opportunities Fund - Growth': ['ICICI PRUDENTIAL HOUSING OPPORTUNITIES FUND - Growth', 150308],
  'Mirae Asset Hybrid-Equity Fund - Regular Plan Growth': ['Mirae Asset Hybrid-Equity Fund -Regular Plan-Growth', 134815],
  'ABSL Bal Bhavishya Yojna Regular Growth': ['ADITYA BIRLA SUN LIFE BAL BHAVISHYA YOJNA REGULAR GROWTH', 146409],
  'Canara Robeco Emerging Equities Regular Growth Growth': ['Canara Robeco Emerging Equities - Regular Plan - GROWTH', 102920],//, 'Canara Robeco Emerging Equities - Regular Plan - GROWTH OPTION'
  'Canara Robeco Bluechip Equity Fund Regular Growth Growth': ['Canara Robeco Bluechip Equity Fund - Regular Plan - Growth', 113221],
  'ICICI Prudential Technology Fund - Regular Plan - Growth': ['ICICI Prudential Technology Fund - Growth', 100363],
  'quant Tax Plan (An ELSS)-Regular Growth Plan-Growth': ['quant Tax Plan - Growth Option - Regular Plan', 100175],
  'ICICI Prudential Value Discovery Fund - Regular Plan - Growth': ['ICICI Prudential Value Discovery Fund - Growth', 102594],
  'ICICI Prudential India Opportunities Fund Growth': ['ICICI Prudential India Opportunities Fund - Cumulative Option', 145896],
  'Aditya Birla Sun Life Retirement Fund - 30s Plan Regular Growth': ['Aditya Birla Sun Life Retirement Fund-The 30s Plan-Regular Growth', 146577],
  'Aditya Birla Sun Life Retirement Fund - 40s Plan Regular Growth': ['Aditya Birla Sun Life Retirement Fund-The 40s Plan-Regular Growth', 146586],
  'ICICI Prudential Long Term Equity Fund-Tax Saving-Regular-Growth': ['ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', 100354],
  'ICICI Prudential Multicap Fund-Regular-Growth': ['ICICI Prudential Multicap Fund - Growth', 101228],
  'ICICI Prudential Ultra Short Term Fund-Regular-Growth': ['ICICI Prudential Ultra Short Term Fund - Growth', 115092],
  'ICICI Prudential Equity Savings Fund-Regular Cumulative': ['ICICI Prudential Equity Savings Fund - Cumulative option', 133051],
  'Invesco India Focused 20 Equity Fund Regular Plan Growth': ['Invesco India Focused 20 Equity Fund - Growth', 148483],
  'Invesco India Flexi Cap Fund-Regular Plan - Growth': ['Invesco India Flexi Cap Fund - Growth', 149766],
  'Aditya Birla Sun Life Frontline Equity Fund -Growth-Regular Plan': ['Aditya Birla Sun Life Frontline Equity Fund-Growth', 103174],
  'ICICI Prudential Smallcap Fund - Regular Plan - Growth': ['ICICI Prudential Smallcap Fund - Growth', 106823],
  'ICICI Prudential Large & Mid Cap Fund - Regular Plan - Growth': ["ICICI Prudential Large & Mid Cap Fund - Institutional Option - I - Growth", 100350],
  'ICICI Prudential Multi-Asset Fund-Regular-Growth (Equity)': ['ICICI Prudential Multi-Asset Fund - Growth', 101144],
  'ICICI Prudential Bluechip Fund-Regular-Growth': ['ICICI Prudential Bluechip Fund - Growth', 108466],
  'Aditya Birla Sun Life Equity Savings Fund - Gr. REGULAR': ['Aditya Birla Sun Life Equity Savings Fund - Regular Plan - Growth', 132998],
  'Franklin India Flexi Cap Fund-Regular-Growth': ['Franklin India Flexi Cap Fund - Growth', 100520],
  "Aditya Birla Sun Life Equity Hybrid'95 Fund - Growth-Regular Plan": ["Aditya Birla Sun Life Equity Hybrid'95 Fund - Regular Plan-Growth", 103155],
  'BANDHAN Sterling Value Fund-Growth-(Regular Plan)': ['BANDHAN Sterling Value Fund - Regular Plan - Growth', 108909],
  'Mirae Asset Large Cap Fund Regular Plan Growth': ['Mirae Asset Large Cap Fund', 107578],
  'ICICI Prudential Innovation Fund Regular Growth': ['ICICI Prudential Innovation Fund - Growth', 151579],
  'ICICI Prudential MidCap Fund - Regular Plan - Growth': ['ICICI Prudential MidCap Fund - Growth', 102528],
  'ICICI Prudential Nifty 50 Index Fund - Growth': ['ICICI Prudential Nifty 50 Index Fund - Cumulative Option', 101349],
  'Quant Flexi Cap Fund Regular Growth Plan-Growth': ['quant Flexi Cap Fund - Growth Option - Regular Plan', 109830],
  'ICICI Prudential Savings Fund-Regular-Growth': ['ICICI Prudential Savings Fund - Growth', 101619],
  'Kotak Flexicap Fund-Regular-Growth': ['Kotak Flexicap Fund - Growth', 112090],
  'Invesco India Multicap Fund-Regular-Growth': ['Invesco India Multicap Fund - Growth Option', 107353],
  'Kotak Emerging Equity Fund -Growth': ['Kotak Emerging Equity Scheme - Growth', 104908],
  'Aditya Birla Sun Life Balanced Advantage Fund Growth-Regular-Growth': ['Aditya Birla Sun Life Balanced Advantage Fund - Regular Plan - Growth Option', 131665],
  'ICICI Prudential Balanced Advantage Fund - Regular Plan - Growth': ['ICICI Prudential Balanced Advantage Fund - Growth', 104685],
  "Aditya BSL Tax Relief'96 Fund- (ELSS U/S 80C of IT ACT) - Growth-Regular Plan": ["Aditya Birla Sun Life Tax Relief '96 - Growth Option", 107745],
  'NIPPON INDIA FLEXICAP FUND-REGULAR PLAN-GROWTH': ['Nippon India Flexi Cap Fund - Regular Plan - Growth Plan - Growth Option', 149089],
  'Nippon India Balanced Advantage Fund - GROWTH PLAN': ['Nippon India Balanced Advantage Fund-Growth Plan-Growth Option', 102846],
  'ICICI Prudential Equity & Debt Fund-Regular-Growth': ['ICICI Prudential Equity & Debt Fund - Growth', 100356],
  'Nippon India SHORT TERM FUND - GROWTH PLAN GROWTH OPTION': ['Nippon India Short Term Fund-Growth Plan', 101665],
  'Aditya Birla Sun Life Focused Equity Fund - Growth-Regular Plan': ['Aditya Birla Sun Life Focused Equity Fund -Growth Option', 103309]
}

class UserPortfolioRepository {
  userId;
  previous;
  userData = {};
  userCanData = {};
  txnTransRes = [];
  txnSysRes = [];
  folioNumbers = [];
  investedAmount = 0;
  fundSchemeCodeList = [];
  perCodeSchemeNames = {};
  perCodeRespUnits = {};
  perCodeCurrentNAV = {};
  perCodeCurrentAmount = {};
  currentAmount = 0;
  perCodeTransactionsForXIRR = {};
  perCodeTransactionsForIRR = {};
  perCodeInvestedAmount = {};
  perCodeXIRRData = {};
  perCodeIRRData = {};
  allCodeDataForXIRR = [];
  allCodeDataForIRR = [];
  allCodeXIIR = 0;
  allCodeIRR = 0;
  codeFundData = [];
  schemeSummary = {};
  transactionTypeCodes = {
    'A': 'Additional Purchase',
    'B': 'Purchase',
    'C': 'SIP Cancel',
    // 'D': 'Dividend Payout',
    // 'E': 'STP',
    // 'G': 'Growth',
    'J': 'SWP',
    'N': 'NFO',
    // 'P': 'Reinvestment',
    'R': 'Redemption',
    // 'S': 'Switch',
    // 'O': 'Switch Out',
    // 'I': 'Switch in',
    // 'T': 'Transfer In',
    'V': 'SIP',
  }
  data = {};

  constructor(uid) {
    // // console.log('UserPortfolioRepository constructor');
    // how to make private variable
    this.userId = uid;
    this.previous = new Date();
    // console.log('userId', this.userId);
  }

  async getUIDData() {
    let query = `select * from users where id = ${this.userId};`;
    let client = await models.pool.connect();
    let results = await client.query(query);
    client.release();
    this.userData = results.rows[0];
    return this.userData.pan_card;
  }

  async getUserCanData(panCard) {
    let query = `select * from user_can_registrations where first_holder_pan ilike '%${panCard}%';`;
    // // console.log('query', query);
    let client = await models.pool.connect();
    let results = await client.query(query);
    client.release();
    this.userCanData = results.rows[0];
    // // console.log('userCanData', this.userCanData);
    return this.userCanData;
  }

  async getTxnData() {
    let query = `select * from txn_response_transaction_rsps where can_number = '${this.userCanData.can}' and utrn != '0' and transaction_status in ('OA', 'RA', 'RP') and transaction_type_code in ('A', 'B', 'N', 'V', 'J', 'R', 'C') and response_amount>0 order by value_date asc;`;
    // // console.log('query', query);
    let client = await models.pool.connect();
    let results = await client.query(query);
    // // console.log('results', results.rowCount);
    // // console.log('results', results.rows);
    // client.release();
    this.txnTransRes = results.rows;
    // // console.log('txnTransRes', this.txnTransRes);
    this.fundSchemeCodeList = [];
    let idsToRemove = [];
    for (let i = 0; i < this.txnTransRes.length; i++) {
      for (let field in this.txnTransRes[i]) {
        if (typeof (this.txnTransRes[i][field]) == 'string') {
          this.txnTransRes[i][field] = this.txnTransRes[i][field].trim();
        }
      }
      if (this.txnTransRes[i].payment_status == null) {
        this.txnTransRes[i].payment_status = '00';
      }
      //if date year is greater than 2999 then make remove it
      if (this.txnTransRes[i].value_date.toString().substring(0, 4) > 2999) {
        idsToRemove.push(this.txnTransRes[i].id);
      }
      this.txnTransRes[i].rta_scheme_code = this.txnTransRes[i].rta_scheme_code.replace(/^0+/, '');
      this.txnTransRes[i].fund_code = this.txnTransRes[i].fund_code.replace(/^0+/, '');
      this.txnTransRes[i].key = this.txnTransRes[i].fund_code + '_' + this.txnTransRes[i].rta_scheme_code;
      if (!this.fundSchemeCodeList.includes(this.txnTransRes[i].key)) {
        this.fundSchemeCodeList.push(this.txnTransRes[i].key);
      }
    }
    // console.log('idsToRemove', idsToRemove);
    for (let i = 0; i < idsToRemove.length; i++) {
      this.txnTransRes = this.txnTransRes.filter(function (obj) {
        return obj.id !== idsToRemove[i];
      });
    }

    this.folioNumbers = [];
    for (let i = 0; i < this.txnTransRes.length; i++) {
      if (this.txnTransRes[i].folio_number != '0' && this.txnTransRes[i].folio_number != '' && !this.folioNumbers.includes(this.txnTransRes[i].folio_number)) {
        this.folioNumbers.push(this.txnTransRes[i].folio_number);
      }
    }
    // console.log('folioNumbers', this.folioNumbers);

    // // console.log('fundschemeCode', this.fundSchemeCodeList);

    query = `select * from txn_response_systematic_rsps where user_id = ${this.userId} and utrn != '0' and transaction_status in ('OA', 'RA', 'RP') and transaction_type_code in ('A', 'B', 'N', 'V', 'J', 'R', 'C') and response_amount>0 order by value_date asc;`;
    // // console.log('query', query);
    client = await models.pool.connect();
    results = await client.query(query);
    // // console.log('results', results.rowCount);
    // // console.log('results', results.rows);
    client.release();
    this.txnSysRes = results.rows;
    for (let i = 0; i < this.txnSysRes.length; i++) {
      for (let field in this.txnSysRes[i]) {
        if (typeof (this.txnSysRes[i][field]) == 'string') {
          this.txnSysRes[i][field] = this.txnSysRes[i][field].trim();
        }
      }
      this.txnSysRes[i].fund_code = this.txnSysRes[i].fund_code.replace(/^0+/, '');
      this.txnSysRes[i].rta_scheme_code = this.txnSysRes[i].rta_scheme_code.replace(/^0+/, '');
      this.txnSysRes[i].key = this.txnSysRes[i].fund_code + '_' + this.txnSysRes[i].rta_scheme_code;
    }
    let rs = [];
    this.txnTransRes.map((item) => {
      if (item.transaction_type_code == 'R') {
        rs.push(item);
      }
    });

    // // console.log('Rs',rs);
    // // console.log('txnSysRes',this.txnSysRes);
    return 0;
  }

  async getPerCodeInvested() {
    for (let i = 0; i < this.txnTransRes.length; i++) {
      if (this.txnTransRes[i].transaction_type_code != 'R' && this.txnTransRes[i].response_amount > 0) {
        // let key = this.txnTransRes[i].fundCode + '_' + txnTransRes[i].rtaSchemeCode;
        this.perCodeInvestedAmount[this.txnTransRes[i].key] = this.perCodeInvestedAmount[this.txnTransRes[i].key] ? this.perCodeInvestedAmount[this.txnTransRes[i].key] + parseFloat(this.txnTransRes[i].amount) : parseFloat(this.txnTransRes[i].amount);
        //perCodeInvestedAmount[txnTransRes[i].rtaSchemeCode]=parseFloat(perCodeInvestedAmount[txnTransRes[i].rtaSchemeCode].toFixed(4));
      }
    }

    for (let i = 0; i < this.txnSysRes.length; i++) {
      let x = parseFloat(this.txnSysRes[i].response_amount);
      this.perCodeInvestedAmount[this.txnSysRes[i].key] = this.perCodeInvestedAmount[this.txnSysRes[i].key] ? this.perCodeInvestedAmount[this.txnSysRes[i].key] + parseFloat(Math.floor(x / 0.99995)) : parseFloat(Math.floor(x / 0.99995));
    }
    // // console.log('perCodeInvestedAmount',this.perCodeInvestedAmount);
    for (let i = 0; i < this.txnTransRes.length; i++) {
      if (this.txnTransRes[i].transaction_type_code == 'R') {
        // // console.log('this.txnTransRes[i].key', this.txnTransRes[i].response_amount);
        this.perCodeInvestedAmount[this.txnTransRes[i].key] = this.perCodeInvestedAmount[this.txnTransRes[i].key] - parseFloat(this.txnTransRes[i].response_amount);
      }
    }
    // // console.log('perCodeInvestedAmount', this.perCodeInvestedAmount);
    return 0;
  }

  async getTotalInvested() {
    this.investedAmount = sum(Object.values(this.perCodeInvestedAmount));
    // // console.log('investedAmount', this.investedAmount);
  }

  async getPerCodeCurrent() {
    for (let i = 0; i < this.fundSchemeCodeList.length; i++) {
      for (let j = 0; j < this.txnTransRes.length; j++) {
        // let key = this.txnTransRes[j].fund_code + '_' + this.txnTransRes[j].rta_scheme_code;
        let key = this.txnTransRes[j].key;
        if (this.fundSchemeCodeList[i] == key) {
          this.perCodeRespUnits[key] = this.perCodeRespUnits[key] ? this.perCodeRespUnits[key] + parseFloat(this.txnTransRes[j].response_units) : parseFloat(this.txnTransRes[j].response_units);
          // // console.log('this.txnTransRes[j].responseUnits', this.txnTransRes[j].response_units);
        }
        if (this.txnTransRes[j].transaction_type_code == 'R') {
          this.perCodeRespUnits[key] = this.perCodeRespUnits[key] - parseFloat(this.txnTransRes[j].response_units);
        }
      }
      // // console.log('perCodeRespUnits', this.perCodeRespUnits);

      for (let j = 0; j < this.txnSysRes.length; j++) {
        let key = this.txnSysRes[j].key;
        if (this.fundSchemeCodeList[i] == key) {
          this.perCodeRespUnits[key] = this.perCodeRespUnits[key] ? this.perCodeRespUnits[key] + parseFloat(this.txnSysRes[j].response_units) : parseFloat(this.txnSysRes[j].response_units);
        }
      }

      for (let j = 0; j < this.txnTransRes.length; j++) {
        let key = this.txnTransRes[j].key;
        if (this.fundSchemeCodeList[i] == this.txnTransRes[j].key) {
          this.perCodeSchemeNames[key] = this.txnTransRes[j].rta_scheme_name;
        }
      }

    }
    // // console.log('perCodeSchemeNames', this.perCodeSchemeNames);
    //   // console.log('perCodeRespUnits', this.perCodeRespUnits);
    //   // console.log('perCodeCurrentNAV', this.perCodeCurrentNAV);
    //   // console.log('perCodeCurrentAmount', this.perCodeCurrentAmount);


    for (let key in this.perCodeSchemeNames) {
      let code = matchSchemes[this.perCodeSchemeNames[key]][1];
      // // console.log('code', code);
      this.perCodeCurrentNAV[key] = await commonHelper.getNavByCode(code);
      this.perCodeCurrentAmount[key] = parseFloat((this.perCodeRespUnits[key] * parseFloat(this.perCodeCurrentNAV[key].nav)).toFixed(4));
    }
    // // console.log('perCodeSchemeNames', this.perCodeSchemeNames);
    // // console.log('perCodeRespUnits', this.perCodeRespUnits);
    // // console.log('perCodeCurrentNAV', this.perCodeCurrentNAV);
    // // console.log('perCodeCurrentAmount', this.perCodeCurrentAmount);
    return 0;
  }

  async getTotalCurrent() {
    this.currentAmount = sum(Object.values(this.perCodeCurrentAmount));
    this.currentAmount = parseFloat(this.currentAmount.toFixed(4));
    // // console.log('currentAmount', this.currentAmount);
    return 0;
  }

  async getPerCodeTransactionsForXIRRIRR() {
    for (let key in this.perCodeCurrentAmount) {
      this.perCodeTransactionsForXIRR[key] = this.txnTransRes.filter(ele => ele.key == key && ele.amount > 0 && ele.transaction_type_code != 'R').map(ele => { return { amount: -parseFloat(Math.ceil(parseFloat(ele.amount))), when: new Date(ele.value_date) } });
      this.perCodeTransactionsForXIRR[key] = this.perCodeTransactionsForXIRR[key].concat(this.txnTransRes.filter(ele => ele.key == key && ele.amount > 0 && ele.transaction_type_code == 'R').map(ele => { return { amount: +parseFloat(Math.ceil(parseFloat(ele.amount))), when: new Date(ele.value_date) } }));

      this.perCodeTransactionsForXIRR[key] = this.perCodeTransactionsForXIRR[key].concat(this.txnSysRes.filter(ele => ele.key == key).map(ele => { return { amount: -parseFloat(Math.ceil(parseFloat(ele.response_amount) + parseFloat(ele.response_amount) * 0.00005)), when: new Date(ele.value_date) } }));
      // want to add all the amount which has transaction type code 'R' with sign 
      this.allCodeDataForXIRR = this.allCodeDataForXIRR.concat(this.perCodeTransactionsForXIRR[key]);
      this.perCodeTransactionsForXIRR[key].push({ amount: this.perCodeCurrentAmount[key], when: this.previous });
      this.perCodeTransactionsForIRR[key] = this.perCodeTransactionsForXIRR[key].map(ele => { return parseFloat(Math.ceil(parseFloat(ele.amount))) });
    }
    this.allCodeDataForXIRR.sort((a, b) => new Date(a.when) - new Date(b.when));
    this.allCodeDataForIRR = this.allCodeDataForXIRR.map(ele => { return parseFloat(ele.amount) });

    // // console.log('allCodeDataForXIRR', this.allCodeDataForXIRR);
    // // console.log('allCodeDataForIRR', this.allCodeDataForIRR);
    // // console.log('perCodeTransactionsForXIRR', this.perCodeTransactionsForXIRR);
    // // console.log('perCodeTransactionsForIRR', this.perCodeTransactionsForIRR);
    return 0;
  }

  async getPerCodeXIRRIRRData() {
    this.perCodeXIRRData = {};
    for (let Code in this.perCodeTransactionsForXIRR) {
      if (this.perCodeTransactionsForXIRR[Code].length >= 2) {
        try {
          // console.log('try ',Code, this.perCodeTransactionsForXIRR[Code]);
          this.perCodeXIRRData[Code] = parseFloat((xirr(this.perCodeTransactionsForXIRR[Code]) * 100).toFixed(4));
        }
        catch (e) {
          // console.log('e ',Code, e);
          this.perCodeXIRRData[Code] = -1;
        }
      }
      else {
        // console.log('else ',Code);
        this.perCodeXIRRData[Code] = 0;
      }
    }
    // // console.log('perCodeXIRRData', this.perCodeXIRRData);

    this.perCodeIIRData = {};
    for (let Code in this.perCodeTransactionsForIRR) {
      if (this.perCodeTransactionsForIRR[Code].length >= 2) {
        try {
          this.perCodeIIRData[Code] = parseFloat((irr(this.perCodeTransactionsForIRR[Code]) * 100).toFixed(4));
        }
        catch (e) {
          this.perCodeIIRData[Code] = 0;
        }
      }
      else {
        this.perCodeIIRData[Code] = 0;
      }
    }
    // // console.log('perCodeIIRData', this.perCodeIIRData);
  }

  async getPortfolioXIRRIRR() {

    this.allCodeDataForXIRR.push({ amount: this.currentAmount, when: new Date() });
    // // console.log('allCodeDataForXIRR', this.allCodeDataForXIRR);
    if (this.allCodeDataForXIRR.length >= 2) {
      try {
        this.allCodeXIIR = parseFloat((xirr(this.allCodeDataForXIRR) * 100).toFixed(4));
      } catch (e) {
        this.allCodeXIIR = 0;
      }
    } else {
      this.allCodeXIIR = 0;
    }
    // // console.log('allCodeXIIR', this.allCodeXIIR);

    this.allCodeDataForIRR.push(this.currentAmount);
    // // console.log('allCodeDataForIRR', this.allCodeDataForIRR);
    if (this.allCodeDataForIRR.length >= 2) {
      try {
        this.allCodeIIR = parseFloat((irr(this.allCodeDataForIRR) * 100).toFixed(4));
      } catch (e) {
        this.allCodeIIR = 0;
      }
    } else {
      this.allCodeIIR = 0;
    }
    // // console.log('allCodeIIR', this.allCodeIIR);
    return 0;
  }

  async getPortfolioDashboardData() {
    if (this.codeFundData.length == 0) {
      let codeFundData = [];
      for (let i = 0; i < this.fundSchemeCodeList.length; i++) {
        if (!codeFundData.includes(this.fundSchemeCodeList[i])) {
          let perCodeData = {};
          let t = this.txnTransRes.filter(ele => ele.key == this.fundSchemeCodeList[i] ? ele : null).filter(ele => ele != null);
          // // console.log('t',t);
          perCodeData.fundName = t[0].fund_name;
          perCodeData.fundCode = t[0].fund_code;
          perCodeData.schemeName = t[0].rta_scheme_name;
          perCodeData.schemeCode = t[0].rta_scheme_code;
          let folioList = [];
          for (let j = 0; j < t.length; j++) {
            if (!folioList.includes(t[j].folio_number)) {
              folioList.push(t[j].folio_number);
            }
          }
          // // console.log('folioList', folioList);
          perCodeData.folioList = folioList;
          // // console.log('perCodeData.folioList',perCodeData.folioList);
          // perCodeData.price = parseFloat(parseFloat(t[0].price).toFixed(4));
          perCodeData.sipAmount = 0;
          for (let j = 0; j < this.txnSysRes.length; j++) {
            if (this.fundSchemeCodeList[i] == this.txnSysRes[j].key && this.txnSysRes[j].response_amount > 0) {
              let x = parseFloat(this.txnSysRes[i].response_amount);
              perCodeData.sipAmount = parseFloat(Math.floor(x / 0.99995));
              break;
            }
          }
          perCodeData.invested = parseFloat(this.perCodeInvestedAmount[this.fundSchemeCodeList[i]].toFixed(2));
          perCodeData.units = parseFloat(this.perCodeRespUnits[this.fundSchemeCodeList[i]].toFixed(2));
          perCodeData.currentNAV = parseFloat(parseFloat(this.perCodeCurrentNAV[this.fundSchemeCodeList[i]].nav).toFixed(2));
          perCodeData.currentValue = parseFloat(this.perCodeCurrentAmount[this.fundSchemeCodeList[i]].toFixed(2));
          perCodeData.xirr = parseFloat(this.perCodeXIRRData[this.fundSchemeCodeList[i]].toFixed(2));
          perCodeData.irr = parseFloat(this.perCodeIIRData[this.fundSchemeCodeList[i]].toFixed(2));
          perCodeData.totalReturns = parseFloat(parseFloat(perCodeData.currentValue - perCodeData.invested).toFixed(2));
          perCodeData.absReturns = parseFloat(((perCodeData.totalReturns / perCodeData.invested) * 100).toFixed(2));
          perCodeData.sinceDate = (this.txnTransRes.filter(ele => ele.key == this.fundSchemeCodeList[i])[0].value_date);
          perCodeData.sinceDate = new Date(perCodeData.sinceDate).toISOString().slice(0, 10);
          perCodeData.sinceYears = parseFloat(parseFloat((new Date() - new Date(perCodeData.sinceDate)) / (1000 * 60 * 60 * 24 * 365)).toFixed(1));
          perCodeData.sinceDays = parseInt((new Date() - new Date(perCodeData.sinceDate)) / (1000 * 60 * 60 * 24));
          //calculate internal rate of return
          if (perCodeData.sipAmount != 0)
            perCodeData.installmentNumber = parseInt(Math.ceil(perCodeData.invested / perCodeData.sipAmount));
          else
            perCodeData.installmentNumber = 1;
          if (perCodeData.sinceDays == 0)
            perCodeData.sinceDays = 1;
          perCodeData.sinceDaysCAGR = parseFloat(parseFloat((Math.pow((perCodeData.currentValue / perCodeData.invested), (365 / perCodeData.sinceDays)) - 1) * 100).toFixed(2));
          // // console.log('perCodeData',perCodeData);
          codeFundData.push(perCodeData);
        }
      }
      // // console.log('codeFundData',codeFundData);
      codeFundData.sort((a, b) => new Date(a.sinceDate) - new Date(b.sinceDate));
      // // console.log('codeFundData',codeFundData);
      this.codeFundData = codeFundData;
    }
    this.data = {
      invested: this.investedAmount,
      current: this.currentAmount,
      totalReturns: parseFloat((this.currentAmount - this.investedAmount).toFixed(2)),
      absReturns: parseFloat(parseFloat(((this.currentAmount - this.investedAmount) / this.investedAmount) * 100).toFixed(2)),
      xirr: parseFloat(this.allCodeXIIR.toFixed(2)),
      irr: parseFloat(this.allCodeIIR.toFixed(2)),
      sinceDaysCAGR: parseFloat(parseFloat(parseFloat((Math.pow((this.currentAmount / this.investedAmount), (365 / parseInt((new Date() - new Date(this.txnTransRes[0].value_date)) / (1000 * 60 * 60 * 24))))) - 1) * 100).toFixed(2)),
      fundData: this.codeFundData,
    }
    // // console.log('final dashboard data', data);
    // return this.data;
  }

  async getLatestDashboardData() {
    if (this.codeFundData.length == 0 || this.data == {}) {
      let pan = await this.getUIDData();
      // console.log('userData done');
      await this.getUserCanData(pan);
      // console.log('userCanData done');
      await this.getTxnData();
      // console.log('txnData done');
      await this.getPerCodeInvested();
      // console.log('perCodeInvested done');
      await this.getTotalInvested();
      // console.log('totalInvested done');
      await this.getPerCodeCurrent();
      // console.log('perCodeCurrent done');
      await this.getTotalCurrent();
      // console.log('totalCurrent done');
      await this.getPerCodeTransactionsForXIRRIRR();
      // console.log('perCodeTransactionsForXIRRIRR done');
      await this.getPerCodeXIRRIRRData();
      // console.log('perCodeXIRRIRRData done');
      await this.getPortfolioXIRRIRR();
      // console.log('portfolioXIRRIRR done');
      await this.getPortfolioDashboardData();
      // console.log('portfolioDashboardData done');
    }
    return this.data;
  }

  async getSchemeSummary(key) {
    if (this.schemeSummary[key]) {
      // console.log('schemeSummary already calculated');
      return this.schemeSummary[key];
    }
    let data = [];
    for (let i = 0; i < this.txnTransRes.length; i++) {
      if (this.txnTransRes[i].key == key) {
        data.push(
          {
            key: this.txnTransRes[i].key,
            folioNumber: this.txnTransRes[i].folio_number,
            amount: parseFloat(this.txnTransRes[i].amount),
            units: parseFloat(this.txnTransRes[i].response_units),
            nav: parseFloat(this.txnTransRes[i].price),
            date: this.txnTransRes[i].value_date.toISOString().slice(0, 10),
            transType: this.transactionTypeCodes[this.txnTransRes[i].transaction_type_code],
            paymentStatus: this.txnTransRes[i].payment_status ?? 'NA',
            transactionStatus: this.txnTransRes[i].transaction_status ?? 'NA',
            installmentNumber: parseInt(this.txnTransRes[i].current_installment_number) ?? -1,
            transactionNumber: this.txnTransRes[i].utrn
          });
      }
    }
    for (let i = 0; i < this.txnSysRes.length; i++) {
      if (this.txnSysRes[i].key == key) {
        let x = parseFloat(this.txnSysRes[i].response_amount);
        data.push({
          key: this.txnSysRes[i].key,
          folioNumber: this.txnSysRes[i].folio_number,
          amount: parseFloat(Math.floor(parseFloat(x / 0.99995))),
          units: parseFloat(this.txnSysRes[i].response_units),
          nav: parseFloat(this.txnSysRes[i].price),
          date: this.txnSysRes[i].value_date.toISOString().slice(0, 10),
          transType: this.transactionTypeCodes[this.txnSysRes[i].transaction_type_code],
          paymentStatus: this.txnSysRes[i].payment_status ?? 'NA',
          transactionStatus: this.txnSysRes[i].transaction_status ?? 'NA',
          installmentNumber: parseInt(this.txnSysRes[i].instalment_number) ?? -1,
          transactionNumber: this.txnSysRes[i].utrn,
        });
      }

    }
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    // set installment number iteratively
    // let I = 1,W = 1,S =   1;
    let folioList = [];
    for (let i = 0; i < data.length; i++) {
      if (!folioList.includes(data[i].folioNumber)) {
        folioList.push(data[i].folioNumber);
      }
    }
    for (let j = 0; j < folioList.length; j++) {
      //TODO: per
      let I = 1, W = 1, S = 1, T = 1, N = 1;
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].folioNumber == folioList[j]) {
          if (data[i].transType == 'SIP') {
            data[i].installmentNumber = I;
            I++;
          }
          else if (data[i].transType == 'SWP') {
            data[i].installmentNumber = W;
            W++;
          }
          else if (data[i].transType == 'NFO') {
            data[i].installmentNumber = N;
            N++;
          }
          else if (data[i].transType == 'Additional Purchase') {
            data[i].installmentNumber = S;
            S++;
          }
          else if (data[i].transType == 'Purchase') {
            data[i].installmentNumber = T;
            T++;
          }
          // else {
          //   if (data[i].installmentNumber == -1) {
          //     data[i].installmentNumber = 0;
          //   }
          // }
        }
      }
    }
    this.schemeSummary[key] = data;
    // // console.log('schemeSummary', this.schemeSummary);
    return true;
  }

  async peekAllData() {
    // console.log("-----------------all Data----------------")
    // console.log('userId', this.userId);
    // // console.log('txnTransRes',this.txnTransRes);
    // // console.log('txnSysRes',this.txnSysRes);
    // console.log('fundSchemeCodeList', this.fundSchemeCodeList);
    // console.log('folioNumbers', this.folioNumbers);
    // console.log('perCodeInvestedAmount', this.perCodeInvestedAmount);
    // console.log('investedAmount', this.investedAmount);
    // console.log('perCodeRespUnits', this.perCodeRespUnits);
    // console.log('perCodeCurrentNAV', this.perCodeCurrentNAV);
    // console.log('perCodeCurrentAmount', this.perCodeCurrentAmount);
    // console.log('currentAmount', this.currentAmount);
    // console.log('perCodeTransactionsForXIRR', this.perCodeTransactionsForXIRR);
    // console.log('perCodeTransactionsForIRR', this.perCodeTransactionsForIRR);
    // console.log('allCodeDataForXIRR', this.allCodeDataForXIRR);
    // console.log('allCodeDataForIRR', this.allCodeDataForIRR);
    // console.log('perCodeXIRRData', this.perCodeXIRRData);
    // console.log('perCodeIIRData', this.perCodeIIRData);
    // console.log('allCodeXIIR', this.allCodeXIIR);
    // console.log('allCodeIIR', this.allCodeIIR);
    // console.log('codeFundData', this.codeFundData);
    // console.log('returned data', this.data);
    for (let key in this.schemeSummary) {
      // console.log('key', key);
      // console.log('schemeSummary', this.schemeSummary[key]);
    }
    // console.log("-----------------all Data----------------")
  }
}

export default {

  async dashboard(req, t) {
    try {
      let data = {};
      // const { query } = req;
      // const queryData = query;
      let userId = req.user.id;
      // console.log('userId dashboard ', userId);
      // let folioNumber = queryData.folioNumber;
      var userRepo = new UserPortfolioRepository(userId);
      await userRepo.getLatestDashboardData();
      // console.log('latest dashboard data done');
      // await userRepo.peekAllData();
      return userRepo;
    }
    catch (error) {
      throw Error(error);
    }
  },

  async perfolio(req, t) {
    // req contains uid, folioNumber, schemeCode, schemeName
    let data = {};
    const { query } = req;
    const queryData = query;
    let userId = req.uid;
    let folioNumber = queryData.folioNumber;
    let schemeCode = queryData.schemeCode;
    // // console.log('schemes', schemeCodes.data.length);

    let userData = await user.findOne({
      where: { id: userId }
    });
    // loadNames();
    let userCanData = await userCanRegistration.findOne({
      where: { firstHolderPan: userData.panCard }
    });

    let investedData = {};
    let leadWhere = {};
    leadWhere.canNumber = userCanData.can;
    // leadWhere.folio_number = { [Op.ne]: null };
    leadWhere.utrn = { [Op.not]: '0' };
    leadWhere.payment_status = { [Op.in]: ['CR', 'IR', 'DG', 'DA', 'PC', 'PD'] };
    leadWhere.transaction_status = { [Op.in]: ['OA', 'RA', 'RP'] };
    leadWhere.transaction_type_code = { [Op.in]: ['A', 'B', 'N', 'V', 'J', 'R', 'C'] };
    const txnTransRes = await txnResponseTransactionRsp.findAll(
      {
        where: leadWhere,
        // attributes: ['folio_number',Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'],
        group: ["id"],
        raw: true,
        order: Sequelize.literal('value_date DESC')
      }
    );

    // // // console.log('txnTransRes', txnTransRes);
    let amountInvestedTrans = 0;
    for (let i = 0; i < txnTransRes.length; i++) {
      amountInvestedTrans += parseFloat(txnTransRes[i].amount);
    }
    let amountCurrentTrans = 0
    for (let i = 0; i < txnTransRes.length; i++) {
      amountCurrentTrans += parseFloat(txnTransRes[i].response_amount);
    }
    // // // console.log('amountInvestedTrans', amountInvestedTrans.toFixed(4), '\namountCurrentTrans', amountCurrentTrans.toFixed(4));

    let folios = txnTransRes.map(ele => ele.FolioNumber);
    // // // console.log('folios', folios);
    let folioList = [];
    for (let i = 0; i < folios.length; i++) {
      if (!folioList.includes(folios[i])) {
        folioList.push(folios[i]);
      }
    }

    // // // console.log('folioList', folioList);
    let leadWhere2 = {};
    leadWhere2.userId = userId;
    leadWhere2.folioNumber = { [Op.notIn]: ['0', ''] };
    leadWhere2.utrn = { [Op.not]: '0' };
    leadWhere2.payment_status = { [Op.in]: ['CR', 'IR', 'DG', 'DA', 'PC', 'PD'] };
    leadWhere2.transaction_status = { [Op.in]: ['OA', 'RA', 'RP'] };
    leadWhere2.transaction_type_code = { [Op.in]: ['V', 'J', 'W', 'V'] };
    let txnSysRes = await txnResponseSystematicRsp.findAll(
      {
        where: leadWhere2,
        // attributes: ['folio_number',Sequelize.fn('SUM', Sequelize.col("response_amount")), 'response_amount'],
        group: ["id"],
        raw: true,
        order: Sequelize.literal('value_date DESC')
      }
    );
    // // // console.log('txnSysRes', txnSysRes);
    let amountInvestedSys = 0;
    let x = 0;
    for (let i = 0; i < txnSysRes.length; i++) {
      x = parseFloat(txnSysRes[i].response_amount);
      amountInvestedSys += parseFloat(Math.floor(x / 0.99995));
    }

  },

  /**
 * Find user detail
 * @param {Object} whereObj
 */
  async findOne(whereObj) {
    try {
      // use pool to find the user
      let client = await models.pool.connect();
      let query = `SELECT * FROM users WHERE id = ${whereObj.id};`;
      // // console.log('query', query);
      let result = await client.query(query);
      // // console.log('result', result.rows[0]);
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
  }
}


