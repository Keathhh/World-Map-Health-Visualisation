////////////////////////////////////// PRIMITIVES //////////////////////////////////////
// baked in object formats for expenditure calculations
var template_yearlyDataDomain     = {2015:[], 2016:[], 2017:[], 2018:[], 2019:[], 2020:[], 2021:[], 2022:[]};
var template_perCountryYearlyData     = {2015:[], 2016:[], 2017:[], 2018:[], 2019:[], 2020:[], 2021:[], 2022:[]};
// var template_perCountryYearlyData = {2015:'', 2016:'', 2017:'', 2018:'', 2019:'', 2020:'', 2021:'', 2022:''};
var template_emptyArray         = [];

// geojosn compliant object to be cloned
var template_namedgeoJson = {
        name    : 'geo',
        type    : 'FeatureCollection',   // type | featurecollection
        features: []                     // features | []  
};

var template_censusEntry = [
        [], structuredClone(template_perCountryYearlyData)
]

var template_censusEntry = {
        qualifiers: "",
        discrims  : [],
        data      : structuredClone(template_perCountryYearlyData),
}

var template_dataDomain = ["",[]]


// 
var template_OECDObject_t = {
        measure       : "",                                             // measure                      expectancy/expenditure/vege|fruits|fat|sugar
        sample_method : "",                                             // survey method
        metric        : "",
        demographic   : [],                                             // array of sex, age
        // annotationMask: [],                                             // positional annotation mask
        yearlyData    : structuredClone(template_perCountryYearlyData)  // yearly datapoint
}

var template_OECDObject = {
        get censuses(){
                return this.censuses
        },
        measure       : "",                                             // measure                      expectancy/expenditure/vege|fruits|fat|sugar
        sample_method : "",                                             // survey method
        metric        : "",
        censuses : [],
        demographic   : [],                                             // array of sex, age
        // annotationMask: [],                                             // positional annotation mask
        yearlyData    : structuredClone(template_perCountryYearlyData)  // yearly datapoint
}

var template_OECDcensusOptions = {
        censusName : "",
        measures : "",
        qualifiers : [],
}

// todo: figure out parser state object
