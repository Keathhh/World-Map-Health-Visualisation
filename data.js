
////////////////////////// DATA OPERATIONS //////////////////////////
function newOECDCensus(measure){
        obj = structuredClone(template_OECDObject)
        obj.measure = measure;
        return obj 
} 

function populateCensusMetadata(censusTemplate, classification, classificationAttrs){
        
        switch (classification) {
                case 1: 
                        censusTemplate.measure = classificationAttrs[1]
                        break
                // case 2||3:        
                //         censusTemplate.demographic = populateDiscriminator(classification, classificationAttrs, censusTemplate.demographic)
                //         // censusTemplate.demographic[0] = classificationAttrs[1]
                //         break
                case 2:
                        censusTemplate.demographic[0] = classificationAttrs[1]
                        break
                case 3:        
                        censusTemplate.demographic[1] = classificationAttrs[1]
                        break
                case 4:
                        censusTemplate.sample_method = classificationAttrs[1]        
                        break
                case 5:
                        censusTemplate.metric = classificationAttrs[1]
                        break
                default:
                        break
        }
        return censusTemplate;
}

function populateDiscriminator(classification, classificationAttrs, demographic){
        switch (classification) {
                case 2: return demographic[0] = classificationAttrs[1]
                case 3: return demographic[1] = classificationAttrs[1]
        }
}

function init_CensusDomainEntry(domain_obj, census_name){
        return domain_obj[census_name] = []
}

function name_mapToGjson(oecdName){
        if (!isOECDState(oecdName)) {
                return parse_OECD(oecdName)   
        } else {
                return oecdName 
        }
        // return 
}

// individual data feature, delta object, added census information, boolean
// returns delta object with the merged data 
function mapDelta(dataFeature, delta, addedCensusName, squash){
        if (squash) {
                // iter through existing delta features
                // console.log(dataFeature)
                // console.log(delta)
                // iter through existing countries in delta
                delta.features.forEach(element => {
                        // console.log(element)
                        if (element.properties.name == dataFeature.properties.name) {
                                // delta feature of added feature name exists?
                                // console.log("found existing country "+element.properties.name)
                                element = dataFeature
                                // console.log(element[addedCensusName])
                                // return delta
                                return delta
                        } /* else {
                                // not?
                                
                                
                        } */
                });
                // delta.features.push(dataFeature)
                return delta
        } else {
                // console.log("mapDelta: squash: "+squash)
                delta.features.push(dataFeature)
                return delta
        }
}

// function 

////////////////////////// MAP DATA ALIASES //////////////////////////

// classificationrow true
function returnClassification(string) {
        // let classification = string.split(":");
        switch (string) {
        case "Unit of measure"         : return 0;      // uneeded- all datasets are yearly
        case "Frequency of observation": return 0;      // also unneeded
        case "Measure"                 : return 1;
        case "Unit of measure"         : return 1;
        case "Sex"                     : return 2;
        case "Age"                     : return 3;
        case "Measurement method"      : return 4;
        case "Combined unit of measure": return 5;
             default                   : return false;
        }
}

function returnMeasure(string) {
        // console.log(string)
        switch (string) {
                /////////////////////////////// CONSUMPTION DATA /////////////////////////////// 
                case "Share of population consuming vegetables daily": return "m_vegetables";
                case "Share of population consuming fruits daily"    : return "m_fruits";
                case "Fat supply"                                    : return "m_fat";
                case "Calories supply"                               : return "m_calories";
                case "Protein supply"                                : return "m_protein";
                case "Sugar supply"                                  : return "m_sugar";
        }
}


// because theres no standardization for country names.
// china china prc, turkye turkey, slovakrep slovak, south korea korea, usoa us, malta not existing, 
function countryMapping(input) {
        switch (input) {
                case "China (People’s Republic of)": return "China";
                case "Türkiye"                     : return "Turkey";
                case "Slovak Republic"             : return "Slovakia";
                case "Korea"                       : return "South Korea";
                case "United States"               : return "United States of America";
                     default                       : return input;
}}


////////////////////////// PARSE FUNCTIONS //////////////////////////

// indetify non oecd: ·, 3 chars in
function isOECDState(string) {
        if (string[0]=="·") {
                return false;
                // return string.slice(3,string.length);
        } else {
                return true;
                // return string;
        }
}

function parse_value(rawValue){
        // console.log(rawValue)
        if (rawValue=="") {
                return null;
        } else {
                tmp = ["",[]]
                annotationDelimiter = "   "
                seg_Val = rawValue.split(annotationDelimiter)
                // console.log(seg_Val)
                
                if (seg_Val.length==1) {
                        // the raw value is not annotated
                        // console.log("not annotated")
                        tmp[0] = seg_Val[0];
                } else {
                        // raw value is annotated
                        // console.log("annotated")

                        // *split implicitly converts to array regardless
                        staggeredAnnotationSearch = seg_Val[0].split(",")
                        // console.log(staggeredAnnotationSearch)
                        tmp[0] = seg_Val[1];        
                        tmp[1] = staggeredAnnotationSearch;       
                }
                // console.log(tmp)
                return tmp;
                 
        }
}

// scenarios: definition Differs, Provisional value, Estimated value, timeseries Break
function parse_annotation(string) {
        if (string=="") {
                return null;
        } else {
                annotationDelimiter = "   "
                annotation = string.split(annotationDelimiter)[0]
                if (annotation[0]=="D"||"P"||"E"||"B") {
                        // *split implicitly converts to array regardless
                        staggeredAnnotationSearch = annotation.split(",")
                        return staggeredAnnotationSearch;
                } 
        }
}

// annotations can also come staggered
function parse_annotatedValue(string){
        if (string[0]=="D") {
                
        }
        if (string[0]=="P") {
                
        }
        if (string[0]=="E") {
                
        }

        if (string[0]=="D" || string[0]=="P" || string[0]=="E" || string[0]=="B") {
                for (let i = 0; i < string.length; i++) {
                        if (string[i] == ' ') {
                                prune = string.slice(2+(i-1), string.length)
                                continue
                        } else {continue}
                }
                // console.log("parse_annotatedValue(): parsed: outputting value "+prune);
                return Number(prune)
        }
        // console.log("parse_annotatedValue(): value is pure: "+string);
        return Number(string)
}

function parse_OECD(string){
        return string.slice(3,string.length);
}

function parse_annotatedCol(string){
        return string.slice(3,string.length);
}



function returnClassificationAttr(string){return string.split(": ")}

function isDataRow(col1string) {
        let split = col1string.split(":");
        if (split.length-1) {
                return false;
        } else {
                return true;
        }
}

function perCountryFlags(column1){
        if (isDataRow(column1)) {
                return [true,false]
        } else {
                return [false,true]
        }
}

function readline(row_Expenditure, census, worldJson, censusName, fileIndex){
        census.yearlyData                            = structuredClone(template_perCountryYearlyData);
        [state_isDataRow, state_isClassificationRow] = perCountryFlags(row_Expenditure.column1)

        //infer lastwasdatarow
        // when 
        // datarow false, classification true:  lastwasdatarow
        //

        if (state_isClassificationRow) {
                classificationAttr    = returnClassificationAttr(row_Expenditure.column1)
                currentClassification = returnClassification(classificationAttr[0])
        }
        
        if (state_isDataRow) {
                lastWasDataRow = fileIndex==(lastWasDataRow+1) ? true : false;
                if (lastWasDataRow) {
                        census                = populateCensusMetadata(census, currentClassification, classificationAttr)
                }

                var {column1, ...rawExpenditure_yearly} = row_Expenditure
                // mapping nonstandard country names: oecd naming -> geojson naming 
                var currentCountry = name_mapToGjson(column1);
                var rawExpenditure_Entries = Object.entries(rawExpenditure_yearly)
                // parse and populate yearly data
                for (let i = 0; i < rawExpenditure_Entries.length; i++) {
                        expenditureEntry = rawExpenditure_Entries[i]
                        y = Object.keys(census.yearlyData)[i] 
                        values = parse_value(expenditureEntry[1])
                        // console.log(y)
                        census.yearlyData[y] = values;
                        if (values!=null) {fullExpenditureDomain.push(Number(values[0]))}
                }

                // iter through world json
                // adding worldjson matches with given data to geotemplate overdraw object
                // context: within iteration of every csv row
                for (let i = 0; i < worldJson.features.length; i++) {
                        // when worldjson country name matches current
                        if (worldJson.features[i].properties.name == countryMapping(currentCountry)) {
                                console.log("found match "+ currentCountry +" on worldObj index: "+i)
                                // populate individual country with census data
                                // structuredclone, probbaly to avoid references
                                worldJson.features[i].expenditure = structuredClone(census);
                                console.log(worldJson.features[i][censusName].yearlyData)
                                // push the populated country onto delta, with conditions
                                dataCountries = mapDelta(worldJson.features[i], dataCountries, censusName, false)
                        }

                }
                state_lastDataRow = fileIndex;

        }
        return "no"
}


function return_dataDomain(string) {
        return "domain_"+string
}



function echo(input, isObj){
        if (debug) {
                if (isObj) {
                        console.log(eval(input))
                } else {
                        console.log(input)
                }
        }
}

function pad_Domain(domain, pad){
        domain[0] = domain[0]-pad
        domain[1] = domain[1]+pad
        return domain
}

///////////////////////////////// CONVERSIONS //////////////////////////////////

// direction: bool
// t: d>y, f: y>d
function conv_per_dayYear(values, direction){
        return values.map((v)=>direction ? v*365 : v/365)
}

function conv_toCals(source, values){
        //https://www.nal.usda.gov/programs/fnic
        // 1g>cal:
        // fat: 9cal
        // protein: 4
        // sugar:  4
        switch (source) {
                case "fat":

                break;
                case "protein":
                break;
                case "sugar":
                break;

        
                default:
                        break;
        }
}