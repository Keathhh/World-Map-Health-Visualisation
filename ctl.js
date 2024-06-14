var mod = function (n, m) {
        var remain = n % m;
        return Math.floor(remain >= 0 ? remain : remain + m);
    };

function returnYear(){
        const yearSel = {0: 2015, 1: 2016, 2: 2017, 3: 2018, 4: 2019, 5: 2020, 6: 2021, 7: 2022}
        // console.log("returnYear(): "+yearSel[document.querySelector('#year').selectedIndex])
        return yearSel[document.querySelector('#year').selectedIndex]
}

function yearSelection(ev){
        // const yearSel = {0: 2015, 1: 2016, 2: 2017, 3: 2018, 4: 2019, 5: 2020, 6: 2021, 7: 2022}
        currentYearSel = returnYear();
        
        //header text redraw
        d3.select("#canvas").select("#yearheading").remove()
        d3.select("#canvas").append("text")
        .attr("id", "yearheading")
        .attr("x", w/2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "40px")
        .text("Statistical year: "+currentYearSel);

        //tooltip redraw
        d3.select("#tooltip").remove()

        //map path redraw
        baselayer.selectAll("path").remove()
        drawMap_baseLayer(baselayer, allCountries, mapPath, currentYearSel)
}

function yearStep(bool){
        if (bool) {
                document.querySelector('#year').selectedIndex = mod((document.querySelector('#year').selectedIndex)+1,8)
        } else {
                document.querySelector('#year').selectedIndex = mod((document.querySelector('#year').selectedIndex)-1,8)
        }
        yearSelection()
}

renderIrrelevant = true;
function toggleRelevance(){
        renderIrrelevant = !renderIrrelevant
        baselayer.selectAll("path").remove()
        if (renderIrrelevant) {
                drawMap_baseLayer(baselayer, allCountries, mapPath, returnYear())
        } else {
                drawMap_baseLayer(baselayer, dataCountries, mapPath, returnYear())

        }
}



animate = false;
function animate_yearly(){
        animate = !animate
        var timer = d3.interval(()=>{
                if (!animate) {timer.stop();}
                yearStep(1);
        }, 2000)
        if (animate) {
                timer
        }
}