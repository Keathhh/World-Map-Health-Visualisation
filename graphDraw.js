////////////////////////////////////// GLOBALS //////////////////////////////////////
// var w = window.innerWidth/1.5; 
// var h = window.innerHeight/1.3;
var w      = 1280;
var Mh      = 580;
var fullh   = 860;
var padding = 30;
// var W                  = w-padding;
// var H                  = h-padding;
var annotation_Yoffset = -70;
var tooltipsize        = 18;

// todo fitextent
var projection = d3.geoMercator().translate([w/2,Mh/1.55]).scale(200).rotate([-3,2,-5])
var mapPath    = d3.geoPath().projection(projection)

var base_lineWidth          = 0.2;
var base_opacity            = 0.65;
var dataTile_lineWidth      = 0.2;
var dataTile_opacity        = 0.95;
var dataUnavail_opacity     = 0.3;
var selected_lineWidthDelta = 0.6;
var selected_opacityDelta   = 0.5;

var dataAbridged_fillStyle = "url(#diagonal-stripe-1)";
var mapOcean_fillStyle     = "url(#smalldot)";
var base_strokeCol         = "#747474";
var selected_strokeCol     = "#2d2d2d";
var base_fillColCountry    = "#c4c4c4";
var colScaleOrange         = ["#fff5eb","#7f2704"]
var colScaleGreen          = ["#e5f5f9","#31a354"]
var colorScale             = d3.scaleLinear().range(["#fff5eb","#7f2704"])


// cal: kcal/d, fat,protein: g/d, fruits: %, vegetables: %,
var stackData = ["m_calories", "m_fruits", "m_fat", "m_protein", "m_sugar", "m_vegetables"]
var stkTargets = []
var stackGen = d3.stack().keys()

var selectedCountry = []




// dataDomain: []
function compute_colorScale(dataDomain) {
        console.log("computing color scale")
        colorScale.domain([+d3.min(dataDomain),+d3.max(dataDomain)])
}

var mask; 

////////////////////////// INIT DRAW FUNCTIONS //////////////////////////
function initSVG() {return d3.select("body").append("svg").attr("width", w).attr("height", fullh);}
function newGroup(context, ident){
        context.append("g").attr("id",ident)
        return context.select("#"+ident)
}

////////////////////////// CLEANUP FUNCTIONS //////////////////////////
function rm_Heading(mapContext){
        mapContext.selectAll("#yearheading").remove()
}

function rm_Paths(mapContext){
        mapContext.selectAll("path").remove()
}


////////////////////////// MAP ELEMENTS //////////////////////////
function drawHeading(context, text, textSize, posX, posY){
        context.append("text")                
        .attr("id", "yearheading")
        .attr("x", posX)
        .attr("y", posY)
        .attr("text-anchor", "middle")
        .style("font-size", textSize)
        .text(text);
}

////////////////////////// DRAW FUNCTIONS //////////////////////////



// dropin replacement when color scheme
function drawMap_details(dataMode, lineStyle, lineWidth, lineCol, fillCol){

}

// animation color override test
function redrawMap(mapContext, jsonData, rescaledMapPath, yearSelection, targetedStatistic){
        compute_colorScale(eval(censusDomain))

        mapContext.selectAll("path")
        .each(
                function(event,d){
                        d3.select(this)
                        .transition().ease(d3.easeExpOut).duration(300)
                        // .attr("stroke-width", (d,i)=>{
                        //         if (d[targetedStatistic]!=undefined) {
                        //                 if (d[targetedStatistic].yearlyData[yearSelection]==null) {
                        //                         return dataTile_lineWidth 
                        //                 }
                        //                 return dataTile_lineWidth+0.3
                        //         } else return base_lineWidth
                        // })
                        // .style("fill",(d,i)=>{return d[targetedStatistic]!=undefined ? (d[targetedStatistic].yearlyData[yearSelection]==null ? dataAbridged_fillStyle : colorScale(d[targetedStatistic].yearlyData[yearSelection][0])) : base_fillColCountry})
                        // .style("fill-opacity",(d,i)=>{
                        //         if (d[targetedStatistic]!=undefined) {
                        //                 if (d[targetedStatistic].yearlyData[yearSelection]==null) {
                        //                         return dataUnavail_opacity 
                        //                 }
                        //                 return dataTile_opacity
                        //         } else return base_opacity
                        // })
                        .attr("stroke-width", (d,i)=>{
                                if (d[targetedStatistic]!=undefined) {
                                        if (d[targetedStatistic].yearlyData[yearSelection]==null) {
                                                return dataTile_lineWidth 
                                        }
                                        return dataTile_lineWidth
                                } else return base_lineWidth
                        })
                        .style("fill",(d,i)=>{return d[targetedStatistic]!=undefined ? (d[targetedStatistic].yearlyData[yearSelection]==null ? dataAbridged_fillStyle : colorScale(d[targetedStatistic].yearlyData[yearSelection][0])) : base_fillColCountry})
                        .style("fill-opacity",(d,i)=>{
                                if (d[targetedStatistic]!=undefined) {
                                        if (d[targetedStatistic].yearlyData[yearSelection]==null) {
                                                return dataUnavail_opacity 
                                        }
                                        return dataTile_opacity
                                } else return base_opacity
                        })
                }
        )   
}

// base layer draw routine
// discardign overdraw strategy, migratying functions
function drawMap(mapContext, jsonData, rescaledMapPath, yearSelection, targetedStatistic){
        // draw the bottom half: the graph section
        // console.log(targetedStatistic)
        compute_colorScale(eval(censusDomain))

        // compute_colorScale(targetedStatistic)
        mapContext.append('line')
        .style("stroke", 'black')
        .attr("stroke-width", 1)
        .attr("x1", 0)
        .attr("y1", Mh)
        .attr("x2", w)
        .attr("y2", Mh)

        mapContext.selectAll("path").data(jsonData.features).enter()
        .append("path").attr("d",rescaledMapPath)
        .attr("stroke",base_strokeCol)
        
       //todo resolve every other data mapping
        .attr("stroke-width", (d,i)=>{
                if (d[targetedStatistic]!=undefined) {
                        if (d[targetedStatistic].yearlyData[yearSelection]==null) {
                                return dataTile_lineWidth 
                        }
                        return dataTile_lineWidth
                } else return base_lineWidth
        })
        .style("fill",(d,i)=>{return d[targetedStatistic]!=undefined ? (d[targetedStatistic].yearlyData[yearSelection]==null ? dataAbridged_fillStyle : colorScale(d[targetedStatistic].yearlyData[yearSelection][0])) : base_fillColCountry})
        .style("fill-opacity",(d,i)=>{
                if (d[targetedStatistic]!=undefined) {
                        if (d[targetedStatistic].yearlyData[yearSelection]==null) {
                                return dataUnavail_opacity 
                        }
                        return dataTile_opacity
                } else return base_opacity
        })
        

        // ternary doesnt seem to return anon var functions- fix
        .on("mouseover", mmmapmouseover)
        .on("mousemove", mmaponmove)
        .on("click", mmaponclick)
        .on("contextmenu", mmaponrclick)
        .on("mouseleave", mmapleave)


}


function mergeData(a, b){}

function selTooltip(statisticSelected, value){
        switch (statisticSelected) {
                case "expenditure": return value+"% of GDP";
                case "expectancy": return "Expectancy: "+value+" years";
                default:
                        break;
        }
}


////////////////////////// EVENT HANDLERS //////////////////////////

mmmapmouseover = function(event,d){
        countryCensus = d[selected_censusName]
        // console.log(countryCensus.yearlyData[currentYearSel][0])

        d3.select("#map").append('line').attr("id", "tracer").attr("pointer-events", "none")
        .style("stroke", 'black')
        .attr("stroke-width", 1)
        .attr("x1", event.offsetX)
        .attr("y1", event.offsetY)
        .attr("x2", scalefromCenter_proportional(true, event.offsetX, w))
        .attr("y2", (mouseQuart(false, event.offsetY, Mh) ? -tooltipsize+2 : 4) + scalefromCenter_proportional(false, event.offsetY, Mh))
        
        d3.select("#map").append("text").attr("id", "tooltip").attr("pointer-events", "none")
        .attr("x", scalefromCenter_proportional(true, event.offsetX, w))
        .attr("y", scalefromCenter_proportional(false, event.offsetY, Mh))
        .attr("text-anchor", "middle")
        .style("font-size", tooltipsize)
        .text(countryCensus!=undefined ? (
                        countryCensus.yearlyData[currentYearSel]==null ? d.properties.name+": data unavailable!" : 
                        d.properties.name+": "+selTooltip(selected_censusName,countryCensus.yearlyData[currentYearSel][0])
                ) : d.properties.name+"- no data")

        // .call(console.log(d[selected_censusName]))

        d3.select(this).transition().ease(d3.easeExpOut).duration(1000)
        .attr("stroke",selected_strokeCol)
        .attr("stroke-width", (d,i)=>{
                if (countryCensus!=undefined) {
                        if (countryCensus.yearlyData[currentYearSel]==null) {
                                return dataTile_lineWidth + selected_lineWidthDelta
                        }
                        return dataTile_lineWidth + selected_lineWidthDelta
                } else return base_lineWidth
        })
        .style("fill-opacity",(d,i)=>{
                if (countryCensus!=undefined) {
                        if (countryCensus.yearlyData[currentYearSel]==null) {
                                return dataUnavail_opacity 
                        }
                        return dataTile_opacity - selected_opacityDelta
                } else return base_opacity - selected_opacityDelta
        })
}

mmapleave = function(event,d){
        d3.select("#tooltip").remove()
        d3.select("#tracer").remove()

        d3.select(this).transition().ease(d3.easeExpOut).duration(1000)
        .attr("stroke", base_strokeCol)
        .attr("stroke-width", (d,i)=>{
                if (countryCensus!=undefined) {
                        if (countryCensus.yearlyData[currentYearSel]==null) {
                                return dataTile_lineWidth
                        }
                        return dataTile_lineWidth
                } else return base_lineWidth
        })
        .style("fill-opacity",(d,i)=>{
                if (countryCensus!=undefined) {
                        if (countryCensus.yearlyData[currentYearSel]==null) {
                                return dataUnavail_opacity 
                        }
                        return dataTile_opacity
                } else return base_opacity
        })
}

mmaponclick = function(event,d){
        if (selectedCountry[1]!=d) {
                selectedCountry[0] = d
        }
        drawBottomLeft(graphlayer, d)
        drawBottomRight(graphlayer, d)
}

mmaponrclick = function(event,d){

        if (selectedCountry[0]!=d) {
                selectedCountry[1] = d
        }
        console.log(selectedCountry)

        drawBottomLeft(graphlayer, d)
        drawBottomRight(graphlayer, d)
}

mmaponmove = function(event,d){
        d3.select("#map").select("#tooltip")
        .attr("x", scalefromCenter_proportional(true, event.offsetX, w))
        .attr("y", scalefromCenter_proportional(false, event.offsetY, Mh))
        d3.select("#map").select("#tracer")
        .attr("x1", event.offsetX)
        .attr("y1", event.offsetY)
        .attr("x2", scalefromCenter_proportional(true, event.offsetX, w))
        .attr("y2", (mouseQuart(false,event.offsetY, Mh) ? -tooltipsize+2 : 4) + scalefromCenter_proportional(false, event.offsetY, Mh))
}




mapClick = function(event, d){
        console.log(d.properties.income_grp);
}

function resetCountryHighlight(){

}

///////////////////////////////////////////////////////////////////////////////////////////////////

function drawBottomLeft(context, data){

        bound_Top = padding
        bound_Bottom = (fullh-Mh)-padding*2
        bound_L = padding
        bound_R = w/2-padding*3


        context = context.select("#left")
        yearly_data = data[selected_censusName].yearlyData

        dataRange = []
        Object.values(yearly_data).forEach(element => {
                if (element!=null) {dataRange.push(Number(element[0]))}
                else {dataRange.push(null)}
        });
        dataBounds = d3.extent(dataRange)


        xScale = d3.scaleTime()
        .domain(d3.extent(Object.keys(yearly_data)))
        .range([bound_L,bound_R])
        // .range([0+padding,w/2-padding])
        
        yScale = d3.scaleLinear()
        .domain(dataBounds)
        .range([bound_Bottom,bound_Top])
        


        // console.log(yScale.ticks())

        domainPad = yScale.ticks()[1]-yScale.ticks()[0]
        dataBounds = pad_Domain(dataBounds,domainPad)
        
        yScale.domain(dataBounds)

        xaxis = d3.axisBottom(xScale)
        .tickFormat((d,i)=>Object.keys(yearly_data)[i])
        
        yaxis = d3.axisLeft(yScale)
        
        function pointSize(d,i){
                console.log("pointsize:")
                if (d===null) {
                        return "0rem"
                } else {
                        return i==[currentYearSel-2015] ? "0.4rem": "0.2rem";
                }
        }

        function point_isCurrent(d,i){
                console.log(`current: ${dataRange[currentYearSel-2015]}`)
                console.log(d)
                return d==dataRange[currentYearSel-2015] ? "0.3rem": "0.2rem";
        }


        
        
        ln = d3.line().x((d,i)=>xScale(2015+i)).y((d,i)=>yScale(d))

        selectedPointCoord = []
        selectedPointCoord = [xScale(currentYearSel), dataRange[currentYearSel-2015] == null ? yScale(d3.min(dataRange)-(domainPad)) : yScale(dataRange[currentYearSel-2015])]
        
        headerString = ""
        switch (selected_censusName) {
                case "expenditure":
                        headerString = `: expenditure for health services, %GDP`
                break;
                
                case "expectancy":
                        headerString = `: average expectancy, years`
                break;
        }
        if (context.select("#dataline").empty()) {

                drawHeading(context, data.properties.brk_name+headerString, "1rem", w/4, bound_Top/6)

                context.attr("transform","translate("+padding+","+(Mh+padding)+")")
                context.append("path")
                .datum(dataRange)
                .attr("id","dataline")
                .attr("d", ln)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                
                context.selectAll()
                .data(dataRange)
                .enter()
                .append("circle")
                .attr("opacity",0.9)
                .attr("id","points")
                .attr("cx", (d,i)=>xScale(2015+i)) .attr("cy", (d,i)=>yScale(d))
                .attr("r",pointSize)
                .attr("fill", "black")
                
                context.append("g").call(xaxis)
                .attr("transform","translate(0,"+(fullh-Mh-padding*2)+")")
                .attr("id","xaxis")
                context.append("g").call(yaxis)
                .attr("transform","translate("+padding+",0)")
                .attr("id","yaxis")

                context.append("line")
                .attr("id", "selectionLine")
                .attr("opacity",0.9)
                .attr("stroke", "red")
                .attr("x1",selectedPointCoord[0])
                .attr("x2",selectedPointCoord[0])
                .attr("y1", (fullh-Mh)-padding*2+(padding/3))
                .attr("y2",selectedPointCoord[1]-(padding/3))


                context.append("line")
                .data(dataRange)
                .attr("id", "levelLine")
                .attr("opacity",0.9)
                .attr("stroke", "red")
                .attr("x1",padding-(padding/3))
                .attr("x2",selectedPointCoord[0]+(padding/3))
                .attr("y1", selectedPointCoord[1])
                .attr("y2", selectedPointCoord[1])



        } else {
                
                context.select("#dataline")
                .datum(dataRange)
                .transition().ease(d3.easeExpOut).duration(1000)
                .attr("d", ln)


                context.selectAll("#points")
                .data(dataRange)
                .transition().ease(d3.easeExpOut).duration(1000)
                
                // .attr("fill",(d,i)=>{d[i]===null?("red"):("black")})
                .attr("cy", (d,i)=>yScale(d))
                .attr("r",pointSize)
                // .attr("r",point_isCurrent ? "0.4rem" : "0.2rem")

                // .attr("r",(d,i)=>{d===null?("red"):("black")})
                // .attr("r",(d,i)=>{return i})
                
                // .call((d,i)=>{console.log(dataRange)})
                // .call(function(d,i){console.log(d)})
                
        

                // context.select("#xaxis")
                // .transition().ease(d3.easeExpOut).duration(1000)
                // .call(xaxis)
                context.select("#yaxis")
                .attr("opacity",0.2)
                .transition().ease(d3.easeSinIn).duration(500)
                .call(yaxis)
                .attr("opacity",1)


                context.select("#yearheading")
                .attr("opacity",0.04)
                .attr("transform",`translate(${-70},0)`)
                .transition().ease(d3.easeExpIn).duration(500)
                .attr("opacity",1)
                .attr("transform",`translate(${0},0)`)
                .text(data.properties.brk_name+headerString)

                context.select("#selectionLine")
                .transition().ease(d3.easeExpOut).duration(500)

                .attr("x1",selectedPointCoord[0])
                .attr("x2",selectedPointCoord[0])
                .attr("y2", selectedPointCoord[1]-(padding/3))

                context.select("#levelLine")
                .transition().ease(d3.easeExpOut).duration(500)

                .attr("x2",selectedPointCoord[0]+(padding/3))
                .attr("y1", selectedPointCoord[1])
                .attr("y2", selectedPointCoord[1])
                
        }


        



}

function refreshBottom(){
        // bar

}

function mouseovergraphPoint(){

}

function mouseleavegraphPoint(){
}


function drawBottomRight(context, data){
        console.log(data)
        bound_Top = padding
        bound_Bottom = (fullh-Mh)-padding*2
        bound_L = w/2+padding
        bound_R = w-padding*3

        kcalUpperBound = 2500;

        context = context.select("#right")

        color = d3.scaleOrdinal(d3.schemeCategory10)

        col_width = 25
        var nodraw = false

        // m_fruits, m_vegetables
        // scale: percentage
        pop_perc = ["m_fruits","m_vegetables"]
        // m_calories, /d>/y, m_sugar: kg>kcal
        //kcal: 2000-2500 per day: https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/understanding-calories/
        // 100g sugar: 401kcal/385kcal :https://fdc.nal.usda.gov/fdc-app.html#/food-details/746784/nutrients
        kcal = ["m_calories", "m_sugar"]
        // m_fat, m_protein
        //fat/cal ratio of around 0.033: https://www.healthline.com/nutrition/how-much-fat-to-eat
        //protein: 0.8g/kg: https://www.health.harvard.edu/blog/how-much-protein-do-you-need-every-day-201506188096
        g_d = ["m_fat", "m_protein"]

        placeholderText = ""

        a = "${val}% of population in ${country} consume ${label}"
        b = "Average citizen in ${country} consumes ~${val} ${label}"
        c = "Average citizen in ${country} consumes ${val} ${label}"



        switch (selectedConsumption) {
                case "pop_perc":
                        try {
                                pop_perc = [Object.values(data[pop_perc[0]].censuses[0].data), Object.values(data[pop_perc[1]].censuses[0].data)]
                                context.attr("opacity",1)        

                                yScale_percentage = d3.scaleLinear()
                                .domain([0,100])
                                .range([(bound_Bottom-padding),0])
                                nodraw = false
                        } 
                        catch (error) {
                                context.attr("opacity",0)        
                                nodraw = true
                        }

                break;
                case "kcal":
                        try {
                                kcal = [Object.values(data[kcal[0]].censuses[0].data), Object.values(data[kcal[1]].censuses[0].data)]
                                context.attr("opacity",1)        

                                kcal[1] = kcal[1].map(d=>{return d!=null ? Math.round((d[0]*3850)/365) : null})
                                kcaltmp = kcal[0].map(d=>{return d!=null ? d[0] : null})

                                yScale_kcal = d3.scaleLinear()
                                .domain([0,d3.max(kcaltmp)]) //domain, datadomain, mark with recommended tick, might need biasing
                                // .domain([0,kcalUpperBound]) //domain, datadomain, mark with recommended tick, might need biasing
                                .range([(bound_Bottom-padding),0])
                                nodraw = false
                        } 
                        catch (error) {
                                nodraw = true
                                context.attr("opacity",0)        
                        }
                break;
                case "g_d":        
                        try {
                                g_d = [Object.values(data[g_d[0]].censuses[0].data), Object.values(data[g_d[1]].censuses[0].data)]
                                context.attr("opacity",1)        
                                nodraw = false
                        } 
                        catch (error) {
                                nodraw = true
                                context.attr("opacity",0)        
                        } 
                        break;
                default:
                        break;
        }



        xScale = d3.scaleTime()
        .domain(d3.extent(Object.keys(yearly_data)))
        .range([0+padding,w/2-padding*3])
        // .range([bound_L,bound_R])
        

        
        yScale_fat = ""
        yScale_protein = ""
        
        xaxis = d3.axisBottom(xScale)
        .tickFormat((d,i)=>Object.keys(yearly_data)[i])
        .tickSize(0)

        var yaxis

        switch (selectedConsumption) {
                case "pop_perc":
                        // console.log(a)
                        placeholderText = a;
                        yaxis = d3.axisLeft(yScale_percentage) 
                        break;
                case "g_d":
                        placeholderText = c;
                        break;
                case "kcal":        
                        placeholderText = b;
                        yaxis = d3.axisLeft(yScale_kcal) 
                        break;
                default:
                        break;
        }

        //todo data check
        //more columns data

        console.log(kcal)

        if (d3.select("#right").select("*").empty()) {
                context.attr("transform",`translate(${bound_L},${Mh+padding})`)

                context.append("text")                
                .attr("id", "yearheading")
                .attr("country",data.properties.brk_name)
                .attr("x", w/4)
                .attr("y", bound_Top/6)
                .attr("text-anchor", "middle")
                .style("font-size", "1rem")
                .text(`Consumption data for ${data.properties.brk_name}: `);

                context.append("g").call(xaxis)
                .attr("transform","translate(0,"+(fullh-Mh-padding*2)+")")
                .attr("id","xaxis")

                context.append("g").call(yaxis)
                .attr("transform","translate("+padding+","+padding+")")
                .attr("id","yaxis")


                context.selectAll().data(pop_perc[0]).enter()
                .append("rect").attr("id", "series0")
                .attr("val", (d)=>{if(d!=null){return Number(d[0])}})
                .attr("label", (d,i)=>{return `vegetable daily in ${i+2015}`})
                .attr("x", (d,i)=>{return xScale(i+2015)})
                .attr("y", (d)=>{if(d!=null){return bound_Bottom-yScale_percentage(Number(100-d[0]))} else {return 0}})
                .attr("height",d=>{if(d!=null){return yScale_percentage(Number(100-d[0]))} else {return 0}})
                .attr("width",col_width)
                // .call((d,i)=>console.log(i))
                .attr("fill", color(1))
                .on("mouseover", barmouseover)
                .on("mouseout", barmouseout)


                context.selectAll().data(pop_perc[1]).enter()
                .append("rect").attr("id", "series1")
                .attr("val", (d)=>{if(d!=null){return Number(d[0])}})
                .attr("label", (d,i)=>{return `fruit daily in ${i+2015}`})
                .attr("x", (d,i)=>{return xScale(i+2015)+col_width+2})
                .attr("y", (d)=>{if(d!=null){return bound_Bottom-yScale_percentage(Number(100-d[0]))} else {return 0}})
                .attr("width",col_width)
                .attr("height",d=>{if(d!=null){return yScale_percentage(Number(100-d[0]))} else {return 0}})
                // .call((d,i)=>console.log(i))
                .attr("fill", color(2))
                .on("mouseover", barmouseover)
                .on("mouseout", barmouseout)

                
        } else {
                context.select("#yearheading")
                .attr("country",data.properties.brk_name)
                .attr("opacity",0.04)
                .attr("transform",`translate(${-70},0)`)
                .transition().ease(d3.easeExpIn).duration(500)
                .attr("opacity",1)
                .attr("transform",`translate(${0},0)`)
                .text(`Consumption data for ${data.properties.brk_name}: `)


                context.select("#yaxis")
                .attr("opacity",0.2)
                .transition().ease(d3.easeSinIn).duration(500)
                .call(yaxis)
                .attr("opacity",1)

                if (selectedConsumption=="pop_perc"&&!nodraw) {
                        console.log(selectedConsumption)
                        context.selectAll("#series0").data(pop_perc[0])
                        .transition().ease(d3.easeExpIn).duration(500)
                        .attr("val", (d)=>{if(d!=null){return Number(d[0])}})
                        .attr("label", (d,i)=>{return `vegetable daily in ${i+2015}`})
                        .attr("width",col_width)
                        .attr("y", (d)=>{if(d!=null){return bound_Bottom-yScale_percentage(Number(100-d[0]))} else {return 0}})
                        .attr("height",d=>{if(d!=null){return yScale_percentage(Number(100-d[0]))} else {return 0}})
        
                        context.selectAll("#series1").data(pop_perc[1])
                        .transition().ease(d3.easeExpIn).duration(500)
                        .attr("val", (d)=>{if(d!=null){return Number(d[0])}})
                        .attr("label", (d,i)=>{return `fruit daily in ${i+2015}`})
                        .attr("width",col_width)
                        .attr("y", (d)=>{if(d!=null){return bound_Bottom-yScale_percentage(Number(100-d[0]))} else {return 0}})
                        .attr("height",d=>{if(d!=null){return yScale_percentage(Number(100-d[0]))} else {return 0}})
                        
                } else if (selectedConsumption=="kcal"&&!nodraw) {
                        console.log(selectedConsumption)
                        context.selectAll("#series0").data(kcal[0])
                        .transition().ease(d3.easeExpIn).duration(500)
                        .attr("val", (d)=>{if(d!=null){return Number(d[0])}})
                        .attr("label", (d,i)=>{return `Kcal per day in ${i+2015}`})
                        .attr("width",col_width)
                        .attr("y", (d)=>{if(d!=null){return bound_Bottom-yScale_kcal(Number(d3.max(kcaltmp)-d[0]))} else {return 0}})
                        .attr("height",d=>{if(d!=null){return yScale_kcal(Number(d3.max(kcaltmp)-d[0]))} else {return 0}})
        
                        context.selectAll("#series1").data(kcal[1])
                        .transition().ease(d3.easeExpIn).duration(500)
                        .attr("val", (d)=>{if(d!=null){return Number(d)}})
                        .attr("label", (d,i)=>{return `Kcals worth of sugar in ${i+2015}`})
                        .attr("width",col_width)
                        .attr("y", (d)=>{if(d!=null){return bound_Bottom-yScale_kcal(Number(d3.max(kcaltmp)-d))} else {return 0}})
                        .attr("height",d=>{if(d!=null){return yScale_kcal(Number(d3.max(kcaltmp)-d))} else {return 0}})

                } else if (selectedConsumption=="g_d"&&!nodraw) {
                        context.selectAll("#series0").data(g_d[0])
                        .transition().ease(d3.easeExpIn).duration(500)
                        .attr("val", (d)=>{if(d!=null){return Number(d[0])}})
                        .attr("label", (d,i)=>{return `Kcal per day in ${i+2015}`})
                        .attr("width",col_width)
                        .attr("y", (d)=>{if(d!=null){return bound_Bottom-yScale_kcal(Number(d[0]))} else {return 0}})
                        .attr("height",d=>{if(d!=null){return yScale_kcal(Number(d[0]))} else {return 0}})
        
                        context.selectAll("#series1").data(g_d[1])
                        .transition().ease(d3.easeExpIn).duration(500)
                        .attr("val", (d)=>{if(d!=null){return Number(d)}})
                        .attr("label", (d,i)=>{return `Kcals worth of sugar in ${i+2015}`})
                        .attr("width",col_width)
                        .attr("y", (d)=>{if(d!=null){return bound_Bottom-yScale_kcal(Number(d))} else {return 0}})
                        .attr("height",d=>{if(d!=null){return yScale_kcal(Number(d))} else {return 0}})
                }
        }
}

barmouseover = function(event, d){
        val = d3.select(this).attr("val")
        country = d3.select("#right").select("#yearheading").attr("country")
        label = d3.select(this).attr("label")

        // console.log(placeholderText)
        d3.select("#right").select("#yearheading")
        .text(eval("`"+placeholderText+"`"))

        d3.select(this)
        .attr("opacity",1)
        .transition().ease(d3.easeLinear).duration(200)
        .attr("opacity",0.7)

        // .text(`${val}% of adults over 18 in ${d3.select("#right").select("#yearheading").attr("country")} consume ${d3.select(this).attr("label")}`)
        // console.log(d3.select(this).attr("label"))
        // console.log(event)
}


barmouseout = function(event, d){
        d3.select("#right").select("#yearheading")
        .text(`Consumption data for ${d3.select("#right").select("#yearheading").attr("country")}:`)
        // console.log(d3.select(this).attr("val"))

        d3.select(this)
        .transition().ease(d3.easeLinear).duration(200)
        .attr("opacity",1)
}

