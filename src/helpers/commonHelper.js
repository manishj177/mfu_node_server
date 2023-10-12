const axios = require("axios");
const { generateConfig } = require("../utils/utils");
// const matchedSchemes = {
//     'SBI Flexi Cap Fund Regular Plan - Growth': ['SBI Flexicap Fund - REGULAR PLAN -Growth Option', 103215],
//     'Aditya Birla Sun Life Digital India Fund - Growth-Regular Plan': ['Aditya Birla Sun Life Digital India Fund - Growth - Regular Plan', 103168],
//     'Axis Mid Cap Fund - Growth': ['Axis Midcap Fund - Growth', 114564],
//     'NAVI FLEXI CAP FUND REGULAR PLAN GROWTH': ['Navi Flexi Cap Fund - Regular Plan - Growth', 143787],
//     'Axis Long Term Equity Fund - Growth': ['Axis Long Term Equity Fund - Growth', 112323],
//     'Mirae Asset Tax Saver Fund - Regular Growth': ['Mirae Asset Tax Saver Fund-Regular Plan-Growth', 135784],
//     'ICICI Prudential Flexicap Fund Growth': ['ICICI Prudential Flexicap Fund - Growth', 148989],
//     'SUNDARAM SELECT FOCUS REGULAR PLAN GROWTH': ['Sundaram Select Focus Regular Plan - Growth', 101537],
//     'SBI LONG TERM EQUITY FUND- REGULAR PLAN - GROWTH': ['SBI LONG TERM EQUITY FUND - REGULAR PLAN- GROWTH', 105628],
//     'Nippon India SMALL CAP FUND - GROWTH PLAN GROWTH OPTION': ['Nippon India Small Cap Fund - Growth Plan - Growth Option', 113177],
//     'ICICI Prudential PSU Equity Fund - Growth': ['ICICI Prudential PSU Equity Fund - Growth', 150538],
//     'Mirae Asset Midcap Fund - Regular Plan Growth': ['Mirae Asset Midcap Fund - Regular Plan-Growth Option', 147479],
//     'ICICI Prudential ESG Fund Growth': ['ICICI Prudential ESG FUND - Growth', 148517],
//     'Canara Robeco Flexi Cap Fund Regular Growth': ['Canara Robeco Flexi Cap Fund - Regular Plan - Growth', 101922],
//     'SBI Savings Fund-Regular-Growth': ['SBI  SAVINGS FUND - REGULAR PLAN - GROWTH', 102503],
//     'Invesco India Largecap Fund - Growth': ['Invesco India Largecap Fund - Growth', 112098],
//     'Parag Parikh Flexi Cap Fund-Regular-Growth': ['Parag Parikh Flexi Cap Fund - Regular Plan - Growth', 122640],
//     'Aditya Birla Sun Life Pharma & Healthcare Fund Regular Growth': ['Aditya Birla Sun Life Pharma and Healthcare Fund-Regular-Growth', 147407],
//     'SUNDARAM LARGE CAP FUND (FORMERLY KNOWN AS SUNDARAM BLUECHIP FUND) - REGULAR GROWTH': ['Sundaram Large Cap Fund(Formerly Known as Sundaram Blue Chip Fund) Regular Plan - Growth', 148504],
//     'Aditya Birla Sun Life Special Opportunities Fund Regular Growth': ['Aditya Birla Sun Life Special Opportunities Fund-Regular Plan-Growth', 148537],
//     'SBI MultiCap Fund - Regular Plan - Growth': ['SBI Multicap Fund- Regular Plan- Growth Option', 149886],
//     'ICICI PRUDENTIAL ASSET ALLOCATOR FUND (FOF) - GROWTH': ['ICICI Prudential Asset Allocator Fund (FOF) - Growth', 102137],
//     'Franklin India TAXSHIELD-GROWTH': ['Franklin India Taxshield-Growth', 100526],
//     'HDFC TaxSaver - Growth': ['HDFC TaxSaver-Growth Plan', 101979],
//     'Nippon India TAX SAVER (ELSS) FUND - GROWTH PLAN - GROWTH OPTION': ['Nippon India Tax Saver (ELSS) Fund-Growth Plan-Growth Option', 103196],
//     'Kotak Tax Saver Scheme - Growth': ['Kotak Tax Saver-Scheme-Growth', 103339],
//     'SBI Contra Fund - Regular Plan - Growth': ['SBI CONTRA FUND - REGULAR PLAN -GROWTH', 102414],
//     'Invesco India Tax Plan - Growth': ['Invesco India Tax Plan - Growth', 104636],
//     'SBI Equity Hybrid Fund - Regular Plan - Growth': ['SBI EQUITY HYBRID FUND - REGULAR PLAN -Growth', 102885],
//     'Aditya Birla Sun Life Flexi Cap Fund - Growth-Regular Plan': ['Aditya Birla Sun Life Flexi Cap Fund - Growth - Regular Plan', 103166],
//     'DSP Equity & Bond Fund-Regular-Growth': ['DSP Equity & Bond Fund- Regular Plan - Growth', 100081],
//     'HDFC Hybrid Equity Fund - Growth': ['HDFC Hybrid Equity Fund - Growth Plan', 102948],
//     'Axis Focused 25 Fund GROWTH': ['Axis Focused 25 Fund - Growth Option', 117560],
//     'SBI Dividend Yield Fund - Regular Plan - Growth': ['SBI Dividend Yield Fund - Regular Plan - Growth', 151476],
//     'Mirae Asset Emerging Bluechip Fund - Regular Plan Growth': ['Mirae Asset Emerging Bluechip Fund - Regular Plan - Growth Option', 112932],
//     'SUNDARAM MID CAP FUND REGULAR GROWTH': ['Sundaram Mid Cap Fund Regular Plan - Growth', 101539],
//     'SBI Large & Midcap Fund-Regular-Growth': ['SBI LARGE & MIDCAP FUND- REGULAR PLAN -Growth', 103024],
//     'Axis Bluechip Fund - Growth': ['Axis Bluechip Fund - Growth', 112277],
//     'Kotak Equity Opportunities Fund - Growth': ['Kotak Equity Opportunities Fund - Growth', 103234],
//     'Aditya Birla Sun Life Multi-Cap Fund Regular Growth': ['Aditya Birla Sun Life Multi-Cap Fund-Regular Growth', 148918],
//     'ICICI Prudential Business Cycle Fund Growth': ['ICICI Prudential Business Cycle Fund Growth', 148653],
//     'ICICI Prudential Transportation and Logistics Fund - Growth': ['ICICI PRUDENTIAL TRANSPORTATION AND LOGISTICS FUND - Growth', 150684],
//     'DSP Small Cap Fund-Regular-Growth': ['DSP Small Cap Fund - Regular - Growth', 105989],
//     'Aditya Birla Sun Life ESG Fund Regular Growth': ['Aditya Birla Sun Life ESG Fund-Regular Plan-Growth', 148635],
//     'MOTILAL OSWAL FLEXI CAP FUND-Regular Growth': ['Motilal Oswal Flexi Cap Fund Regular Plan-Growth Option', 129048],
//     'Tata Digital India Fund Regular Plan Growth': ['Tata Digital India Fund-Regular Plan-Growth', 135797],
//     'Invesco India Midcap Fund - Growth': ['Invesco India Midcap Fund - Growth Option', 105503],
//     'Invesco India Growth Opportunities Fund- Growth': ['Invesco India Growth Opportunities Fund - Growth', 106144],
//     'ICICI Prudential Short Term Fund - Growth Option': ['ICICI Prudential Short Term Fund - Growth Option', 101758],
//     'SBI Liquid Fund - Regular Plan - Growth': ['SBI Liquid Fund - REGULAR PLAN -Growth', 105280],
//     'SBI Technology Opportunities Fund - Regular Plan - Growth': ['SBI TECHNOLOGY OPPORTUNITIES FUND - REGULAR PLAN - GROWTH', 120577],
//     'Nippon India GROWTH FUND - GROWTH PLAN GROWTH OPTION': ['Nippon India Growth Fund-Growth Plan-Growth Option', 100377],
//     'Invesco India PSU Equity Fund - Growth': ['Invesco India PSU Equity Fund - Growth', 112171],
//     'SBI Balanced Advantage Fund - Regular Growth': ['SBI Balanced Advantage Fund - Regular Plan - Growth', 149132],
//     'SBI Small Cap Fund-Regular-Growth': ['SBI Small Cap Fund - Regular Plan - Growth', 125494],
//     'Aditya Birla Sun Life Asset Allocator FoF Regular Growth': ['Aditya Birla Sun Life Asset Allocator FoF- Regular Plan - Growth Option', 131864],
//     'SBI Corporate Bond Fund - Regular Plan Growth': ['SBI Corporate Bond Fund - Regular Plan - Growth', 146207],
//     'Nippon India Ultra Short Duration Fund - GROWTH OPTION': ['Nippon India Ultra Short Duration Fund- Growth Option', 143493],
//     'SBI Blue Chip Fund - Regular Plan - Growth': ['SBI BLUE CHIP FUND-REGULAR PLAN GROWTH', 103504],
//     'Aditya Birla Sun Life PSU Equity Fund Regular-Growth': ['Aditya Birla Sun Life PSU Equity Fund-Regular Plan-Growth', 147846],
//     'Aditya Birla Sun Life Business Cycle Fund Regular Growth': ['Aditya Birla Sun Life Business Cycle Fund-Regular-Growth', 149296],
//     'Nippon India Focused Equity Fund- GROWTH PLAN GROWTH OPTION': ['Nippon India Focused Equity Fund -Growth Plan -Growth Option', 104637],
//     'Invesco India Contra Fund - Growth': ['Invesco India Contra Fund - Growth', 105460],
//     'HDFC Mid-Cap Opportunities Fund - Growth': ['HDFC Mid-Cap Opportunities Fund - Growth Plan', 105758],
//     'SBI Multi Asset Allocation Fund - Regular Plan - Growth': ['SBI MULTI ASSET ALLOCATION FUND - REGULAR PLAN - GROWTH', 103408],
//     'ICICI Prudential Housing Opportunities Fund - Growth': ['ICICI PRUDENTIAL HOUSING OPPORTUNITIES FUND - Growth', 150308],
//     'Mirae Asset Hybrid-Equity Fund - Regular Plan Growth': ['Mirae Asset Hybrid-Equity Fund -Regular Plan-Growth', 134815],
//     'ABSL Bal Bhavishya Yojna Regular Growth': ['ADITYA BIRLA SUN LIFE BAL BHAVISHYA YOJNA REGULAR GROWTH', 146409],
//     'Canara Robeco Emerging Equities Regular Growth Growth': ['Canara Robeco Emerging Equities - Regular Plan - GROWTH', 102920],//, 'Canara Robeco Emerging Equities - Regular Plan - GROWTH OPTION'
//     'Canara Robeco Bluechip Equity Fund Regular Growth Growth': ['Canara Robeco Bluechip Equity Fund - Regular Plan - Growth', 113221],
//     'ICICI Prudential Technology Fund - Regular Plan - Growth': ['ICICI Prudential Technology Fund - Growth', 100363],
//     'quant Tax Plan (An ELSS)-Regular Growth Plan-Growth': ['quant Tax Plan - Growth Option - Regular Plan', 100175],
//     'ICICI Prudential Value Discovery Fund - Regular Plan - Growth': ['ICICI Prudential Value Discovery Fund - Growth', 102594],
//     'ICICI Prudential India Opportunities Fund Growth': ['ICICI Prudential India Opportunities Fund - Cumulative Option', 145896],
//     'Aditya Birla Sun Life Retirement Fund - 30s Plan Regular Growth': ['Aditya Birla Sun Life Retirement Fund-The 30s Plan-Regular Growth', 146577],
//     'Aditya Birla Sun Life Retirement Fund - 40s Plan Regular Growth': ['Aditya Birla Sun Life Retirement Fund-The 40s Plan-Regular Growth', 146586],
//     'ICICI Prudential Long Term Equity Fund-Tax Saving-Regular-Growth': ['ICICI Prudential Long Term Equity Fund (Tax Saving) - Growth', 100354],
//     'ICICI Prudential Multicap Fund-Regular-Growth': ['ICICI Prudential Multicap Fund - Growth', 101228],
//     'ICICI Prudential Ultra Short Term Fund-Regular-Growth': ['ICICI Prudential Ultra Short Term Fund - Growth', 115092],
//     'ICICI Prudential Equity Savings Fund-Regular Cumulative': ['ICICI Prudential Equity Savings Fund - Cumulative option', 133051],
//     'Invesco India Focused 20 Equity Fund Regular Plan Growth': ['Invesco India Focused 20 Equity Fund - Growth', 148483],
//     'Invesco India Flexi Cap Fund-Regular Plan - Growth': ['Invesco India Flexi Cap Fund - Growth', 149766],
//     'Aditya Birla Sun Life Frontline Equity Fund -Growth-Regular Plan': ['Aditya Birla Sun Life Frontline Equity Fund-Growth', 103174],
//     'ICICI Prudential Smallcap Fund - Regular Plan - Growth': ['ICICI Prudential Smallcap Fund - Growth', 106823],
//     'ICICI Prudential Large & Mid Cap Fund - Regular Plan - Growth': ["ICICI Prudential Large & Mid Cap Fund - Institutional Option - I - Growth", 100350],
//     'ICICI Prudential Multi-Asset Fund-Regular-Growth (Equity)': ['ICICI Prudential Multi-Asset Fund - Growth', 101144],
//     'ICICI Prudential Bluechip Fund-Regular-Growth': ['ICICI Prudential Bluechip Fund - Growth', 108466],
//     'Aditya Birla Sun Life Equity Savings Fund - Gr. REGULAR': ['Aditya Birla Sun Life Equity Savings Fund - Regular Plan - Growth', 132998],
//     'Franklin India Flexi Cap Fund-Regular-Growth': ['Franklin India Flexi Cap Fund - Growth', 100520],
//     "Aditya Birla Sun Life Equity Hybrid'95 Fund - Growth-Regular Plan": ["Aditya Birla Sun Life Equity Hybrid'95 Fund - Regular Plan-Growth", 103155],
//     'BANDHAN Sterling Value Fund-Growth-(Regular Plan)': ['BANDHAN Sterling Value Fund - Regular Plan - Growth', 108909],
//     'Mirae Asset Large Cap Fund Regular Plan Growth': ['Mirae Asset Large Cap Fund', 107578],
//     'ICICI Prudential Innovation Fund Regular Growth': ['ICICI Prudential Innovation Fund - Growth', 151579],
//     'ICICI Prudential MidCap Fund - Regular Plan - Growth': ['ICICI Prudential MidCap Fund - Growth', 102528],
//     'ICICI Prudential Nifty 50 Index Fund - Growth': ['ICICI Prudential Nifty 50 Index Fund - Cumulative Option', 101349],
//     'Quant Flexi Cap Fund Regular Growth Plan-Growth': ['quant Flexi Cap Fund - Growth Option - Regular Plan', 109830],
//     'ICICI Prudential Savings Fund-Regular-Growth': ['ICICI Prudential Savings Fund - Growth', 101619],
//     'Kotak Flexicap Fund-Regular-Growth': ['Kotak Flexicap Fund - Growth', 112090],
//     'Invesco India Multicap Fund-Regular-Growth': ['Invesco India Multicap Fund - Growth Option', 107353],
//     'Kotak Emerging Equity Fund -Growth': ['Kotak Emerging Equity Scheme - Growth', 104908],
//     'Aditya Birla Sun Life Balanced Advantage Fund Growth-Regular-Growth': ['Aditya Birla Sun Life Balanced Advantage Fund - Regular Plan - Growth Option', 131665],
//     'ICICI Prudential Balanced Advantage Fund - Regular Plan - Growth': ['ICICI Prudential Balanced Advantage Fund - Growth', 104685],
//     "Aditya BSL Tax Relief'96 Fund- (ELSS U/S 80C of IT ACT) - Growth-Regular Plan": ["Aditya Birla Sun Life Tax Relief '96 - Growth Option", 107745],
//     'NIPPON INDIA FLEXICAP FUND-REGULAR PLAN-GROWTH': ['Nippon India Flexi Cap Fund - Regular Plan - Growth Plan - Growth Option', 149089],
//     'Nippon India Balanced Advantage Fund - GROWTH PLAN': ['Nippon India Balanced Advantage Fund-Growth Plan-Growth Option', 102846],
//     'ICICI Prudential Equity & Debt Fund-Regular-Growth': ['ICICI Prudential Equity & Debt Fund - Growth', 100356],
//     'Nippon India SHORT TERM FUND - GROWTH PLAN GROWTH OPTION': ['Nippon India Short Term Fund-Growth Plan', 101665],
//     'Aditya Birla Sun Life Focused Equity Fund - Growth-Regular Plan': ['Aditya Birla Sun Life Focused Equity Fund -Growth Option', 103309]
//   }
export default {
    roundNumber(number, round = 2) {
        var roundVal = 100;
        if (round == 3) {
            roundVal = 1000;
        }
        return Math.round(number * roundVal) / roundVal;
    },


    async getNavByCode(schemeCode) {
        try {
            const url = `https://api.mfapi.in/mf/${schemeCode}/latest`;
            const config = {
                method: "get",
                url: url,
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios(config);
            console.log(response.data.data[0]['nav']);
            return await response.data.data[0];
        } catch (error) {
            return [];
        }
    }
}
