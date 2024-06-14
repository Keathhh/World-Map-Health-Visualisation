////////////////////////////////////// GLOBALS //////////////////////////////////////
// var currentYearSel;
animate = false;
renderIrrelevant = true;
superimpose = false;

var selectedConsumption = ""


// census has a name, type and qualifiers

////////////////////////////////////// DOM INTERFACING //////////////////////////////////////

// returns the year string from dom year dropdown list
// needed, as its only accessible by index which needs mapping
function returnYear(){
        const yearSel = {0: 2015, 1: 2016, 2: 2017, 3: 2018, 4: 2019, 5: 2020, 6: 2021, 7: 2022}
        // console.log("returnYear(): "+yearSel[document.querySelector('#year').selectedIndex])
        return yearSel[document.querySelector('#year').selectedIndex]
}

function onYearSelection(ev){
        // const yearSel = {0: 2015, 1: 2016, 2: 2017, 3: 2018, 4: 2019, 5: 2020, 6: 2021, 7: 2022}
        currentYearSel = returnYear();
        censusDomain = "domain_"+selected_censusName;
        document.querySelector('#player').value = currentYearSel


        //map path redraw
        // rm_Paths(baselayer)
        if (renderIrrelevant) {
                redrawMap(baselayer, allCountries, mapPath, returnYear(), selected_censusName)
        } else {
                redrawMap(baselayer, dataCountries, mapPath, returnYear(), selected_censusName)

        }
        if (selectedCountry[0]!=undefined) {
                drawBottomLeft(graphlayer, selectedCountry[0])
        }


        //header text redraw
        // rm_Heading(baselayer)
        // drawHeading(baselayer, currentYearSel, 40, w/2, 40)
}




function yearStep(bool){
        if (bool) {
                document.querySelector('#year').selectedIndex = mod((document.querySelector('#year').selectedIndex)+1,8)
        } else {
                document.querySelector('#year').selectedIndex = mod((document.querySelector('#year').selectedIndex)-1,8)
        }
        document.querySelector('#player').value = returnYear()
        onYearSelection()
}

function toggleRelevance(ev){
        renderIrrelevant = !ev.checked
        baselayer.selectAll("path").remove()
        censusDomain = "domain_"+selected_censusName;

        if (renderIrrelevant) {
                drawMap(baselayer, allCountries, mapPath, returnYear(), selected_censusName)

        } else {
                drawMap(baselayer, dataCountries, mapPath, returnYear(), selected_censusName)


        }
}



function animate_yearly(ev){
        // console.log(ev.checked)

        animate = ev.checked
        var timer = d3.interval(()=>{
                if (!animate) {timer.stop();}
                yearStep(1);
        }, 2000)
        if (animate) {
                timer
        }
}

function selectStat(ev) {
        console.log(ev.value)

        d3.select("#left").selectAll("*").remove()
        // d3.select("#right").selectAll("*").remove()

        switch (ev.value) {
                case "expectancy":
                        selected_censusName = "expectancy";
                        censusDomain = "domain_"+selected_censusName;
                        colorScale.range(colScaleGreen)
                        redrawMap(baselayer, allCountries, mapPath, returnYear(), selected_censusName)
                        break;

                case "expenditure":
                        selected_censusName = "expenditure";
                        censusDomain = "domain_"+selected_censusName;
                        colorScale.range(colScaleOrange)
                        redrawMap(baselayer, allCountries, mapPath, returnYear(), selected_censusName)
                        break;
        
                default:
                        break;
        }



}

function toggleSuperimpose(ev){

}

function sliderMove(ev){
        console.log(ev.value)
        document.querySelector('#year').selectedIndex = ev.value-2015

        onYearSelection()
        // redrawMap(baselayer, allCountries, mapPath, returnYear(), selected_censusName)

}

function selectConsumption(ev){
        console.log(ev.value)

        switch (Number(ev.value)) {
                case 1:
                selectedConsumption = "pop_perc"
                break;
                case 2:
                selectedConsumption = "g_d"
                break;
                case 3:
                selectedConsumption = "kcal"
                break;
        }
        if (selectedCountry[0]!=undefined) {
                drawBottomRight(graphlayer, selectedCountry[0])
        }

}