// ColorBrewer palette.
var colorBrewer = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"];

// Retrieving random colour from ColorBrewer palette array.
function randomInt() {
    return Math.floor(Math.random() * Math.floor(10));
}

var selected_country;

d3.csv("GCI_CompleteData2.csv", function(error, data){

    // Define margins
    var margin = {top: 25, right: 25, bottom: 50, left: 50};

    //Width and height
    var outer_width = 1000;
    var outer_height = 500;
    var svg_width = outer_width - margin.left - margin.right;
    var svg_height = outer_height - margin.top - margin.bottom;

    // The global data set object
    var dataset;

    // Set up the scale to be used on the x axis
    xScale = d3.scaleLog()
                    .range([0, svg_width]);

    // Set up the scale to be used on the y axis
    yScale = d3.scaleLinear()
                    .range([svg_height, 0]);

    // Circle radius according to population
    radiusScale = d3.scaleSqrt()
                    .range([0,50]);

    // Create an x-axis connected to the x scale
    var xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(4)
                    .tickFormat(d3.format(",.2f"));

    //Define Y axis
    var yAxis = d3.axisLeft()
                      .scale(yScale)
                      .ticks(5);
	

    //Create SVG element as a group with the margins transform applied to it
	//Bubble Plot
    var svg = d3.select("#box-one")
                .append("svg")
                .attr("width", svg_width + margin.left + margin.right)
                .attr("height", svg_height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	//Create SVG element as a group with the margins transform applied to it
	//Bar Chart
    var svg2 = d3.select("#box-two")
                .append("svg")
                .attr("width", svg_width + margin.left + margin.right)
                .attr("height", svg_height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	//Set up the scale to be used on the x axis
	//Bar Chart
    var xScaleBar = d3.scaleBand()
                    .range([0, svg_width], 0.1)
					.paddingInner(0.05)
					.paddingOuter(0.05);
						
    //Set up the scale to be used on the y axis
	//Bar Chart
    var yScaleBar = d3.scaleLinear()
                    .range([svg_height, 0]);

		// Create an x-axis connected to the x scale
	//Bar Chart
    var xAxisBar = d3.axisBottom()
                    .scale(xScaleBar)
                    .ticks(12);

    //Define Y axis
	//Bar Chart
    var yAxisBar = d3.axisLeft()
                      .scale(yScaleBar)
                      .ticks(7);
	
    // Year.
    var display_year = 2007;

    // Year function.
    function yearFilter(value){
        return (value.Year == display_year);
     }

    // Format year.
    var formatYear = d3.timeParse("%Y");
    
    // Setting height of DIV containers.
    $(".box").css({"height":$(window).height()});
    $("#box-right").css({"height":$(window).height()});
    
    // Setting padding for DIV containers.
    $("#box-one").css({"padding-left":($(".box").width() - 1000)/2});
    $("#box-one").css({"padding-top":($(".box").height() - 500)/2});
    $("#box-two").css({"padding-left":($(".box").width() - 1000)/2});
    $("#box-two").css({"padding-top":($(".box").height() - 500)/2});

    function generateVis(){

        // Filter data for year.
        var data_filtered = dataset.filter(yearFilter);

        /******** HANDLE UPDATE SELECTION ************/
        svg.selectAll("circle")
            .data(data_filtered)
            .transition()
            .duration(500)
            .ease(d3.easeCubic)
            .attr("cx", function(d){
                                if (d.GDP !== 0) {
                                    return xScale(+d.GDP);   
                                }
                            })
            .attr("cy", function(d){
                                if (d.Global_Competitiveness_Index !== 0) {
                                    return yScale(+d.Global_Competitiveness_Index);   
                                }
                            })
            .attr("r", function(d,i) {
                if (d.Population !== 0) {
                    return radiusScale(+d.Population);   
                }
            })
            .attr("id", function(d) {
                return d.Country;
            })
            .style("fill", function(d,i) {
                return colorBrewer[randomInt()];
            })
            .style("opacity", "0.8");

        /******** HANDLE ENTER SELECTION ************/
        svg.selectAll("circle")
            .data(data_filtered)
            .enter()
                    .append("circle")
                    .transition()
                    .duration(500)
                    .ease(d3.easeCubic)
                    .attr("cx", function(d){
                                        if (d.GDP !== 0) {
                                            return xScale(+d.GDP);   
                                        }
                                    })
                    .attr("cy", function(d){
                                        if (d.Global_Competitiveness_Index !== 0) {
                                            return yScale(+d.Global_Competitiveness_Index);   
                                        }
                                    })
                    .attr("r", function(d,i) {
                        if (d.Population !== 0) {
                            return radiusScale(+d.Population);   
                        }
                    })
                    .attr("id", function(d) {
                        return d.Country;
                    })
                    .style("fill", function(d,i) {
                        return colorBrewer[randomInt()];
                    })
                    .style("opacity", "0.8")
                    .style("cursor", "pointer");

        /******** HANDLE EXIT SELECTION ************/
        svg.exit()
            .transition()
            .duration(500)
            .attr("r", 0)
            .remove();

        // On mouse over event, trigger info display box
        svg.selectAll("circle")
            .data(data_filtered)
                .on("mouseover", function(d) {
                    // Add country name.
                    var coordinates = d3.mouse(this);
                    // Population formatting
                    var f = d3.format(",");
                    // Remove country box.
                    svg.append("rect")
                        .attr("x", coordinates[0] - 60)
                        .attr("y", coordinates[1] + 30)
                        .attr("fill", "#fff")
                        .attr("height", "30px")
                        .attr("width", "80px")
                        .attr("id", "country-box");
                    // Add country name.
                    svg.append("text")
                        .attr("x", coordinates[0] - 60)
                        .attr("y", coordinates[1] + 10)
                        .attr("dy", "1em")
                        .attr("font-size", "15px")
                        .attr("id", "country-name")
                        .attr("font-family", "sans-serif")
                        .attr("stroke", "#fff")
                        .attr("fill", "#fff")
                        .text(d.Country);
                    // Add population title.
                    svg.append("text")
                        .attr("x", coordinates[0] - 60)
                        .attr("y", coordinates[1] + 30)
                        .attr("dy", "1em")
                        .attr("font-size", "11px")
                        .attr("id", "country-pop-title")
                        .attr("font-family", "sans-serif")
                        .attr("stroke", "#000")
                        .attr("fill", "#000")
                        .text("Population");
                    // Add population.
                    svg.append("text")
                        .attr("x", coordinates[0] - 60)
                        .attr("y", coordinates[1] + 45)
                        .attr("dy", "1em")
                        .attr("font-size", "11px")
                        .attr("id", "country-pop")
                        .attr("font-family", "sans-serif")
                        .attr("stroke", "#000")
                        .attr("fill", "#000")
                        .text(f(d.Population));
                })
                .on("mouseout", function(d) {
                    // Remove country box.
                    d3.select("#country-box").remove();
                    // Remove country name.
                    d3.select("#country-name").remove();
                    // Remove country population title.
                    d3.select("#country-pop-title").remove();
                    // Remove country population.
                    d3.select("#country-pop").remove();
                })
                .on("click", function(d) {
                    generateVisBar(d);
                    $('html, body').animate({
                        scrollTop: $("#box-two").offset().top
                    }, 800);
                });

        // Changes year on svg canvas.
        svg.selectAll("#year_text")
            .data(data_filtered)
                .text(function(d) {
                    return d.Year;
                });

    }
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	
	// Function to generate Bar Chart
    function generateVisBar(data){
        
		var barPadding = 5;
		var barWidth = 50;

        /******** HANDLE UPDATE SELECTION ************/
		// Append the rectangles for the bar chart
		svg2.selectAll("rect")
			.data(data)
            .transition()
            .duration(500)
            .ease(d3.easeCubic)
			.attr("x", function(d) {
				   	return xScaleBar(d.Country);
			})
			.attr("y", function(d) {
				   	return yScaleBar(+d.Innovation);
			})
			.attr("width", xScaleBar.bandwidth())
			.attr("height", function(d) {
				   	return svg_height - yScaleBar(+d.Innovation);
			})
			 .style("fill", "steelblue");        

        /******** HANDLE ENTER SELECTION ************/
		svg2.selectAll("rect")
			.data(data)
			.enter()
				.append("rect")
				.attr("x", function(d) {
						return xScaleBar(d.Country);
				})
				.attr("y", function(d) {
						return yScaleBar(+d.Innovation);
				})
				.attr("width", xScaleBar.bandwidth())
				.attr("height", function(d) {
						return svg_height - yScaleBar(+d.Innovation);
				})
				 .style("fill", "steelblue");

        /******** HANDLE EXIT SELECTION ************/
        svg2.exit()
            .transition()
            .duration(500)
            .remove();

        // Changes year on svg canvas.
        svg2.selectAll("#year_text")
            .data(data)
                .text(function(d) {
                    return d.Year;
                });
            
    }
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	
	

    // handle any data loading errors
    if (error) {
        console.log("Something went wrong");
        console.log(error);
    } else {

        // Convert each variable to numeric type and parse the date
        data.forEach(function(d){ 
                    var year = formatYear(d['Year']);
                    d['Year'] = year.getFullYear();
                    d['GDP'] = +d['GDP'];
                    d['Global_Competitiveness_Index'] = +d['Global_Competitiveness_Index']; 
                    d['Population'] = +d['Population'];
					d['Institutions'] = +d['1st_pillar_Institutions'];
					d['Infrastructure'] = +d['2nd_pillar_Infrastructure'];
					d['Macroeconomic Environment'] = +d['3rd_pillar_Macroeconomic_environment'];
					d['Health and Primary Education'] = +d['4th_pillar_Health_and_primary_education'];
					d['Higher Education and Training'] = +d['5th_pillar_Higher_education_and_training'];
					d['Goods Market Efficiency'] = +d['6th_pillar_Goods_market_efficiency'];
					d['Labor Market Efficiency'] = +d['7th_pillar_Labor_market_efficiency'];
					d['Financial Market Development'] = +d['8th_pillar_Financial_market_development'];
					d['Technological Readiness'] = +d['9th_pillar_Technological_readiness'];
					d['Market Size'] = +d['10th_pillar_Market_size'];
					d['Business Sophistication'] = +d['11th_pillar_Business_sophistication_'];
					d['Innovation'] = +d['12th_pillar_Innovation'];
                });	

        // Assign the data object loaded to the global dataset variable
        dataset = data;

        // Set the domains of the x and y scales using the data
        var max_gdp = d3.max(dataset, function(d) { return d.GDP;} );
        var max_gci = d3.max(dataset, function(d) { return d.Global_Competitiveness_Index;} );

        xScale.domain([100, max_gdp + 100000]);
        yScale.domain([1, max_gci+1]);
		xScaleBar.domain([0, 12]);
		yScaleBar.domain([0, 10]);

        // Set max population value for circle radii
        var max_pop = d3.max(dataset, function(d) { return d.Population;} );
        radiusScale.domain([0, max_pop]);

        // Create the x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + svg_height + ")")
            .call(xAxis)
            .append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("stroke", "#000")
                .attr("fill", "#000")
                .attr("x", "440")
                .attr("y", "40")
                .attr("dy", ".15em")
                .text("GDP (Billions)");

        // Create the y axis
        svg.append("g")
            .attr("class", "axis")
            .attr("id", "y-axis")
            .call(yAxis)
            .append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("stroke", "#000")
                .attr("fill", "#000")
                .attr("x", "-150")
                .attr("y", "-25")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-90)")
                .text("Global Competitiveness Index");

        // SVG canvas background
        svg.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("fill", "#000")
            .attr("height", "425px")
            .attr("width", "925px");

        // SVG canvas year
        svg.append("text")
                .attr("x", "350")
                .attr("y", "250")
                .attr("dy", "1em")
                .attr("font-size", "100px")
                .attr("font-family", "sans-serif")
                .attr("stroke", "#fff")
                .attr("id", "year_text")
                .text(display_year);

		// Create the x-axis
		// Bar Chart
        svg2.append("g")
            .attr("class", "axis")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + svg_height + ")")
            .call(xAxisBar)
            .append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("stroke", "#000")
                .attr("fill", "#000")
                .attr("x", "440")
                .attr("y", "40")
                .attr("dy", ".15em")
                .text("12 Pillars");

        // Create the y axis
		// Bar Chart
        svg2.append("g")
            .attr("class", "axis")
            .attr("id", "y-axis")
            .call(yAxisBar)
            .append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("stroke", "#000")
                .attr("fill", "#000")
                .attr("x", "-150")
                .attr("y", "-25")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-90)")
                .text("Pillar Value");

        // SVG canvas background
		// Bar Chart
        svg2.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("fill", "#000")
            .attr("height", "425px")
            .attr("width", "925px");

        // SVG canvas year
		// Bar Chart
        svg2.append("text")
                .attr("x", "350")
                .attr("y", "250")
                .attr("dy", "1em")
                .attr("font-size", "100px")
                .attr("font-family", "sans-serif")
                .attr("stroke", "#fff")
                .attr("id", "year_text")
                .text(display_year);
		
		
        // Generate the visualisation
        generateVis();

        // Runs loop for year.
        var currentYear = setInterval(stopStart, 2000);

        // For looping through each year.
        function stopStart() {
            display_year = display_year	+	1;	
            if(display_year > 2017) display_year = 2007;

            // Generate the visualisation
            //generateVis();

        }

        // Loop boolean check
        var playLoop = true;

        // Start/Stop code for looping through each year.
        $("#stopStartButton").click(function() {
            if (playLoop === true) {
                clearInterval(currentYear);
                $(this).text("Start");
                playLoop = false;
            } else {
                currentYear = setInterval(stopStart, 2000);
                $(this).text("Stop");
                playLoop = true;
            }
        });
        
        // For selecting a specific year from dropdown.
        $(".yearSelect").click(function(){
           // Stop loop if running.
           if (playLoop === true) {
                clearInterval(currentYear);
                playLoop = false;
                $("#stopStartButton").text("Start");
            }
            
            display_year = $(this).text();
            // Generate the visualisation
            generateVis();	
        });
        
        // Dropdown menu for selecting countries.
        // Has search functionality.
        $("#countrySelect").select2({
                theme: 'bootstrap',
                width: '100%',
                containerCssClass: 'selectDrop',
                dropdownCssClass: 'selectDropMenu' 
        });
        
        // Set for storing unique occurrences of countries in dataset.
        var countryList = new Set();
        
        // Loop through dataset, adding countries to set.
        for (i = 0; i < dataset.length; i++) {
            countryList.add(dataset[i]['Country']);
        }
        
        // Populate dropdown from country names in set.
        for (let item of countryList) {
            $("#countrySelect").append("<option value=" + item + ">" + item + "</option>");
        };
        
    }

});
        