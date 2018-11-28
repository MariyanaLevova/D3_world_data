// ColorBrewer palette
//var colorBrewer = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"];
var colorBrewer = ["#a50026", "#f46d43", "#fdae61", "#abd9e9",  "#74add1", "#4575b4", "#313695"];
 var regions = ["Europe and North America",
"Middle East and North Africa",
"Sub-Saharan Africa",
"Latin America and the Caribbean",
"Eurasia",
"South Asia",
"East Asia and Pacific"];

// Retrieving random colour from ColorBrewer palette array
function randomInt() {
    return Math.floor(Math.random() * Math.floor(10));
}

// Load the data set
d3.csv("GCI_CompleteData4.csv", function(error, data) {

    // Define margins
    var margin = {
        top: 25,
        right: 25,
        bottom: 50,
        left: 50
    };

    //Width and height
    var outer_width = 1000;
    var outer_height = 500;
    var svg_width = outer_width - margin.left - margin.right;
    var svg_height = outer_height - margin.top - margin.bottom;

    // The global data set object
    var dataset;

    // Bubble Plot

    // Set up the scale to be used on the x axis
    xScale = d3.scaleLog()
        .range([0, svg_width]);

    // Set up the scale to be used on the y axis
    yScale = d3.scaleLinear()
        .range([svg_height, 0]);

    // Circle radius according to population.
    radiusScale = d3.scaleSqrt()
        .range([0, 50]);

    // Create an x-axis connected to the x scale.
    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(3)
        .tickFormat(d3.format(",.2f"));

    // Define Y axis.
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5);


    // Create SVG element as a group with the margins transform applied to it.
    // Bubble Plot.
    var svg = d3.select("#box-one")
        .append("svg")
        .attr("width", svg_width + margin.left + margin.right)
        .attr("height", svg_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Store column names in array so can reference below for multi-variate data.
    var columnNames = [
        'Institutions',
        'Infrastructure',
        'Macroeconomic Environment',
        'Health and Primary Education',
        'Higher Education and Training',
        'Goods Market Efficiency',
        'Labor Market Efficiency',
        'Financial Market Development',
        'Technological Readiness',
        'Market Size',
        'Business Sophistication',
        'Innovation'
    ];
	
    // Store column names in array so can reference in bar chart comparison.
    var columnNames2 = [
        '',
		'Institutions',
        '',
        'Infrastructure',
	    '',
        'Macroeconomic Environment',
		'',
        'Health and Primary Education',
		'',
        'Higher Education and Training',
		'',
        'Goods Market Efficiency',
		'',
        'Labor Market Efficiency',
		'',
        'Financial Market Development',
		'',
        'Technological Readiness',
		'',
        'Market Size',
		'',
        'Business Sophistication',
		'',
        'Innovation'
    ];

    var xAxisBarChart = function(d, i) {
        return columnNames[i] + " ";
    }
	
    var xAxisBarChartComparison = function(d, i) {
        return columnNames2[i] + " ";
    }

    // Year.
    var display_year = 2007;
	
	// Holding loop data.
	var loopBars = null;
    
    // Country name for bar chart.
    var countryNameBarChart;
    
    // Identifies whether trail feature is selected or not.
    var trail = false;
    
    // Holding loop data for comparison bars.
    var comparisonLoop = null;
    
    // Variable for holding country names.
    var selectedCountry;
    
    // Check if comparison feature is selected or not.
    var comparisonCheck = false;

    // Primary year function for filtering all data except data for tracing path of country across canvas.
    function yearFilter(value) {
        return (value.Year == display_year);
    }

    // Format year.
    var formatYear = d3.timeParse("%Y");

    // Setting height of DIV containers.
    $("#box-a").css({
        "height": $(window).height()
    });
    $("#box-right").css({
        "height": $(window).height()
    });

    // Setting padding for DIV containers.
    $("#box-one").css({
        "padding-left": ($(".box").width() - 1000) / 2
    });
    $("#box-one").css({
        "padding-top": ($(".box").height() - 500) / 2
    });

    // Global SVG variables.
    var svgBar;
    var xScaleBar;
    var xAxisBar;
    var yScaleBar;
    var yAxisBar;

    function createBarCanvas() {
            
        // Setting height of DIV containers.
        $("#box-b").css({
            "height": $(window).height()
        });
        $("#box-two").css({
        "padding-left": ($(".box").width() - 1000) / 2
        });
        $("#box-two").css({
            "padding-top": ($(".box").height() - 500) / 4
        });

        //Create SVG element as a group with the margins transform applied to it
        svgBar = d3.select("#box-two")
            .append("svg")
			.attr("id", "svgTwo")
            .attr("width", svg_width + margin.left + margin.right)
            .attr("height", svg_height + margin.top + margin.bottom + 100)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Set up the scale to be used on the x axis
        xScaleBar = d3.scaleBand()
            .range([0, svg_width], 0.5)
            .paddingInner(0.05)
            .paddingOuter(0.05);

        // Create an x-axis connected to the x scale
        xAxisBar = d3.axisBottom()
            .scale(xScaleBar)
            .tickFormat(xAxisBarChart)
            .tickSize(0);
		
        // Create an x-axis connected to the x scale
        xAxisBarComparison = d3.axisBottom()
            .scale(xScaleBar)
            .tickFormat(xAxisBarChartComparison)
            .tickSize(0);

        //Set up the scale to be used on the y axis
        yScaleBar = d3.scaleLinear()
            .domain([0, 7])
            .range([svg_height, 0]);

        //Define Y axis
        yAxisBar = d3.axisLeft()
            .scale(yScaleBar)
            .ticks(7);

        // Create the x-axis
        svgBar.append("g")
            .attr("class", "axis")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + svg_height + ")")
            .append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("stroke", "#000")
            .attr("fill", "#000")
            .attr("x", "440")
            .attr("y", "40")
            .attr("dy", ".15em");

        // Create the y axis
        svgBar.append("g")
            .attr("class", "axis")
            .attr("id", "y-axis")
            .append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("stroke", "#000")
            .attr("fill", "#000")
            .attr("x", "-150")
            .attr("y", "-25")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");
		
		svgBar.append("text")
            .attr("id", "bar-chart-title")
            .attr("x", (svg_width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("font-weight", "bold") 
            .style("display", "none")
            .style("font-family", "Montserrat, sans-serif")
            .text("Competitve Index Pillars");

    }
    
    // For looping through each year.
    function loopBarChart(countryNameBarChart) {
        // Generate the visualisation
        generateVisBar(countryNameBarChart, display_year);
    }

    function generateVis(tracer) {

        // Filter data for year.
        var data_filtered = dataset.filter(yearFilter);

        /******** HANDLE UPDATE SELECTION ************/
        svg.selectAll("circle")
            .data(data_filtered)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("cx", function(d) {
                // Check for empty values.
                if (d.GDP != "" && d.Global_Competitiveness_Index != "" && d.Population != "") {
                    return xScale(+d.GDP);
                }
            })
            .attr("cy", function(d) {
                // Check for empty values.
                if (d.GDP != "" && d.Global_Competitiveness_Index != "" && d.Population != "") {
                    return yScale(+d.Global_Competitiveness_Index);
                }
            })
            .attr("r", function(d, i) {
                // Check for empty values.
                if (d.GDP != "" && d.Global_Competitiveness_Index != "" && d.Population != "") {
                    return radiusScale(+d.Population);
                }
            })
            .attr("id", function(d) {
                return d.Country;
            })
            .style("fill", function(d, i) {
                //return colorBrewer[randomInt()];
                return colorBrewer[regions.indexOf(d.Region)];
            })
            .style("opacity", function(d) { if(tracer === true) { return "0.3" } return "0.8" });

        /******** HANDLE ENTER SELECTION ************/
        svg.selectAll("circle")
            .data(data_filtered)
            .enter()
            .append("circle")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("cx", function(d) {
                // Check for empty values.
                if (d.GDP != "" && d.Global_Competitiveness_Index != "" && d.Population != "") {
                    return xScale(+d.GDP);
                }
            })
            .attr("cy", function(d) {
                // Check for empty values.
                if (d.GDP != "" && d.Global_Competitiveness_Index != "" && d.Population != "") {
                    return yScale(+d.Global_Competitiveness_Index);
                }
            })
            .attr("r", function(d, i) {
                // Check for empty values.
                if (d.GDP != "" && d.Global_Competitiveness_Index != "" && d.Population != "") {
                    return radiusScale(+d.Population);
                }
            })
            .attr("id", function(d) {
                return d.Country;
            })
            .style("fill", function(d, i) {
                return colorBrewer[regions.indexOf(d.Region)];
            })
            .style("opacity", function(d) { if(tracer === true) { return "0.3" } return "0.8" })
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

                var element =  document.getElementById('svgTwo');
                if (element == null || element == undefined) {
                    // Create SVG canvas.
                    createBarCanvas();
                    if (playLoop === true) {
                        // Runs loop for bars.
                        loopBars = setInterval(function(){ generateVisBar(d.Country, display_year); }, 2000);  
                        countryNameBarChart = d.Country;
                    } else {
                        // Bar chart, but not in loop as play button stopped.
                        loopBars = loopBarChart(d.Country);
                        countryNameBarChart = d.Country;
                    }
                    
                } else {
                    
                    // Remove canvas elements.
                    if (comparisonCheck === false) {
                        // Clear single bar chart.
                        clearInterval(loopBars);  
                      
                    } else {
                        // Clear comparison bar chart.
                        clearInterval(comparisonLoop);
                        comparisonCheck = false;
                        
                    }
                    
                    if (playLoop === true) {
                        // Runs loop for bars.
                        loopBars = setInterval(function(){ generateVisBar(d.Country, display_year); }, 2000);
                        countryNameBarChart = d.Country;
                    } else {
                        // Bar chart, but not in loop as play button stopped.
                        loopBars = loopBarChart(d.Country);
                        countryNameBarChart = d.Country;
                    }
                }
            
                // Reset country select dropdown.
                if ($("#countrySelect option:selected").text() != "") {
                    // Set country comparison selector to null.
                    $("#countrySelect").val('').trigger('change');   
                }
            
                // Show bar chart title.
                $("#bar-chart-title").css({"display": "block"});

                // Show bar chart legend.
                $("#pill-box-one").css({"display": "block"});
                $("#pill-one-text").text(countryNameBarChart);

                // Update bar chart year.
                $("#year-legend").css({"display": "block"});

                // Clear legend of comparison country.
                $("#pill-two-text").empty();
                $("#pill-box-two").hide();
            
                // Scroll down to next SVG canvas.
                $('html, body').animate({
                    scrollTop: $("#box-two").offset().top
                }, 800);
            });

        // Changes year on svg canvas.
        svg.selectAll("#year_text")
            .attr("x", "350")
            .attr("y", "250")
            .data(data_filtered)
            .text(function(d) {
                return d.Year;
            });

    }

    function generateVisTrail(points) {

        /******** HANDLE ENTER SELECTION ************/
        points
            .enter()
            .append("ellipse")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("cx", function(d) {
                if (d.GDP !== 0) {
                    return xScale(+d.GDP);
                }
            })
            .attr("cy", function(d) {
                if (d.Global_Competitiveness_Index !== 0) {
                    return yScale(+d.Global_Competitiveness_Index);
                }
            })
            .attr("rx", function(d, i) {
                if (d.Population !== 0) {
                    return radiusScale(+d.Population);
                }
            })
		            .attr("ry", function(d, i) {
                if (d.Population !== 0) {
                    return radiusScale(+d.Population);
                }
            })
            .attr("class", function(d) {
                return d.Country;
            })
            .style("fill", function(d) {
                return colorBrewer[1];
            })
            .style("stroke", function(d) {
                return "#fff";
            })
            .style("stroke-width", function(d) {
                return "4";
            })
            .style("opacity", "0.8")
            .style("cursor", "pointer");
        
        d3.select('#box-one').select('svg').selectAll('ellipse')
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
            
                var element =  document.getElementById('svgTwo');
                if (element == null || element == undefined) {
                    // Create SVG canvas.
                    createBarCanvas();
                    if (playLoop === true) {
                        // Runs loop for bars.
                        loopBars = setInterval(function(){ generateVisBar(d.Country, display_year); }, 2000);  
                        countryNameBarChart = d.Country;
                    } else {
                        // Bar chart, but not in loop as play button stopped.
                        loopBars = loopBarChart(d.Country);
                        countryNameBarChart = d.Country;
                    }
                    
                } else {
                    // Remove canvas elements.
                    if (comparisonCheck === false) {
                        // Clear single bar chart.
                        clearInterval(loopBars);    
                    } else {
                        // Clear comparison bar chart.
                        clearInterval(comparisonLoop);
                        comparisonCheck = false;
                    }
                    
                    if (playLoop === true) {
                        // Runs loop for bars.
                        loopBars = setInterval(function(){ generateVisBar(d.Country, display_year); }, 2000);
                        countryNameBarChart = d.Country;
                    } else {
                        // Bar chart, but not in loop as play button stopped.
                        loopBars = loopBarChart(d.Country);
                        countryNameBarChart = d.Country;
                    }
                }
            
                // Reset country select dropdown.
                if ($("#countrySelect option:selected").text() != "") {
                    // Set country comparison selector to null.
                    $("#countrySelect").val('').trigger('change');   
                }
            
                // Scroll down to bar chart.
                $('html, body').animate({
                    scrollTop: $("#box-two").offset().top
                }, 800);
            });
        
    }
    
    // Function to generate Bar Chart
    function generateVisBar(country, year) {
		
		//svgBar.select("#title").remove();
		
		// Call the axes
		svgBar.select("#x-axis")
            .call(xAxisBar);
		svgBar.select("#y-axis")
            .call(yAxisBar);

        // Country function
        function countryFilter(value) {
            return (value.Country == country);
        }

        // Year function.
        function yearFilter(value) {
            return (value.Year == year);
        }

        // Filter the data as before
        var filtered_dataset = dataset.filter(yearFilter);
        var country_filtered = filtered_dataset.filter(countryFilter);

        // Loop through every element in the filtered dataset and add to array dataHold
        // Doing this because otherwise the D3 functions only run once.
        // The arrayHold will hold 12 objects each composed of one of the columns from the CSV
        // The D3 functions will use arrayHold              // They will now iterate 12 times - one iteration for each column.

        dataHold = [];
        for (i = 0; i < columnNames.length; i++) {
            var temp = columnNames[i];
            // Create object
            var tempObj = {};
            // Add column to object with key = 'Column' and value = Innovation etc.
            // The key value ('Column') is the same for all CSV columns
            // It means in the D3 functions below I can just say d3.Column to call it.
            tempObj["Column"] = country_filtered[0][temp];
            // Append object to dataHold to create new row in array
            dataHold.push(tempObj);
        }

        // Update the domain of the x scale
        xScaleBar.domain(dataHold.map(function(d, i) {
            return d.Column;
        }));
        // Call the x-axis
        svgBar.select("#x-axis")
            .call(xAxisBar)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .style("font", "bold 10px sans-serif")
            .attr("transform", function(d) {
                return "rotate(-65)"
            });

        /******** PERFORM DATA JOIN ************/
        // Join new data with old elements, if any.
        var bars = svgBar.selectAll("rect")
            .data(dataHold);

        /******** HANDLE ENTER SELECTION ************/
        bars.enter()
            .append("rect")
			.attr("class", "bars")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("x", function(d, i) {
                return xScaleBar(+d.Column);
            })
            .attr("y", function(d, i) {
                return yScaleBar(+d.Column);
            })
            .attr("width", xScaleBar.bandwidth())
            .attr("height", function(d, i) {
                return svg_height - yScaleBar(+d.Column);
            })
            .style("fill", "#4575b4")
            .style("opacity", "1");

        /******** HANDLE UPDATE SELECTION ************/
        // Append the rectangles for the bar chart
        bars
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("x", function(d, i) {
                return xScaleBar(+d.Column);
            })
            .attr("y", function(d) {
                return yScaleBar(+d.Column);
            })
            .attr("width", xScaleBar.bandwidth())
            .attr("height", function(d) {
                return svg_height - yScaleBar(+d.Column);
            })
            .style("fill", "#4575b4")
            .style("opacity", "1");

        /******** HANDLE EXIT SELECTION ************/
        // Remove bars that no longer have a matching data element
        bars.exit().remove();

        // On mouse over event, trigger info display box
        svgBar.selectAll("rect")
            .data(dataHold)
            .on("mouseover", function(d) {
                // Add country name.
                var coordinates = d3.mouse(this);
                // Population formatting
                var f = d3.format(",");
                // Remove country box.
                svgBar.append("rect")
                    .attr("x", coordinates[0] )
                    .attr("y", coordinates[1] + 10)
                    .attr("fill", "#fff")
                    .attr("height", "35px")
                    .attr("width", "100px")
                    .attr("id", "country-box");

			     svgBar.append("text")
                    .attr("x", coordinates[0] )
                    .attr("y", coordinates[1] + 10)
                    .attr("dy", "1em")
                    .attr("font-size", "13px")
                    .attr("id", "year")
                    .attr("font-family", "sans-serif")
                    .attr("stroke", "#000")
                    .attr("fill", "#000")
                    .text(display_year);

                // Add population.
                svgBar.append("text")
                    .attr("x", coordinates[0] )
                    .attr("y", coordinates[1] + 30)
                    .attr("dy", "1em")
                    .attr("font-size", "11px")
                    .attr("id", "bar-value")
                    .attr("font-family", "sans-serif")
                    .attr("stroke", "#000")
                    .attr("fill", "#000")
                    .text(d.Column.toFixed(3));
            })
            .on("mouseout", function(d) {
    
                // Remove country name.
                d3.select("#country-box").remove();
                // Remove country population title.
                d3.select("#bar-value").remove();
                d3.select("#year").remove();
            
            })
        
        // Update year.
        $("#year-legend-text").text(display_year);
        
    }
	
function countryComparison() {
	
        // Filter data per country per year
        // Year function.
        function yearFilter(value) {
            return (value.Year == display_year);
        }
	
	    // Country1 function
        function countryFilter1(value) {
            return (value.Country == countryNameBarChart);
        }
	
	    // Country2 function
        function countryFilter2(value) {
            return (value.Country == selectedCountry);
        }

        // Filter the data.
        var filtered_dataset = dataset.filter(yearFilter);
        var country_filtered1 = filtered_dataset.filter(countryFilter1);
        var country_filtered2 = filtered_dataset.filter(countryFilter2);
	
		var combinedData = [];
        for (i = 0; i < columnNames.length; i++) {
            var temp = columnNames[i];
            // Create object
            var tempObj1 = {};
            var tempObj2 = {};
            // Add column to object with key = 'Column' and value = Innovation etc.
            // The key value ('Column') is the same for all CSV columns
            // It means in the D3 functions below I can just say d3.Column to call it.
            tempObj1["Column"] = country_filtered1[0][temp];
            tempObj2["Column"] = country_filtered2[0][temp];
            // Append objects to dataHold to create new row in array.
            combinedData.push(tempObj1);
            combinedData.push(tempObj2);
        }
	
	   // Update the domain of the x scale
        xScaleBar.domain(combinedData.map(function(d, i) {
            return d.Column;
        }));
    
        // Call the x-axis
        svgBar.select("#x-axis")
            .call(xAxisBarComparison)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .style("font", "bold 10px sans-serif")
            .attr("transform", function(d) {
                return "translate(-20, 0)"
            })
            .attr("transform", function(d) {
                return "rotate(-65)"
            });
	
	    /******** PERFORM DATA JOIN ************/
        // Join new data with old elements, if any.
        var bars = svgBar.selectAll("rect")
            .data(combinedData);

        /******** HANDLE ENTER SELECTION ************/
        bars.enter()
            .append("rect")
			.attr("class", "bars")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("x", function(d, i) {
                return xScaleBar(+d.Column);
            })
            .attr("y", function(d, i) {
                return yScaleBar(+d.Column);
            })
            .attr("width", xScaleBar.bandwidth())
            .attr("height", function(d, i) {
                return svg_height - yScaleBar(+d.Column);
            })
            // Could maybe use this to show a comparison between two countries?
            .style("fill", function(d, i) {
                if (i % 2 == 0) {
                    return "#d73027";
                } else {
                    return "#4575b4";
                }
            });

        /******** HANDLE UPDATE SELECTION ************/
        // Append the rectangles for the bar chart
        bars
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("x", function(d, i) {
                return xScaleBar(+d.Column);
            })
            .attr("y", function(d) {
                return yScaleBar(+d.Column);
            })
            .attr("width", xScaleBar.bandwidth())
            .attr("height", function(d) {
                return svg_height - yScaleBar(+d.Column);
            })
            // Could maybe use this to show a comparison between two countries?
            .style("fill", function(d, i) {
                if (i % 2 == 0) {
                    return "#d73027";
                } else {
                    return "#4575b4";
                }
            });

        /******** HANDLE EXIT SELECTION ************/
        // Remove bars that no longer have a matching data element
        bars.exit().remove();
        // On mouse over event, trigger info display box
        svgBar.selectAll("rect")
            .data(combinedData)
            .on("mouseover", function(d) {
                // Add country name.
                var coordinates = d3.mouse(this);
                // Population formatting
                var f = d3.format(",");
                // Remove country box.
                svgBar.append("rect")
                    .attr("x", coordinates[0] )
                    .attr("y", coordinates[1] + 10)
                    .attr("fill", "#fff")
                    .attr("height", "35px")
                    .attr("width", "100px")
                    .attr("id", "country-box");
                
			     svgBar.append("text")
                    .attr("x", coordinates[0] )
                    .attr("y", coordinates[1] + 10)
                    .attr("dy", "1em")
                    .attr("font-size", "13px")
                    .attr("id", "year")
                    .attr("font-family", "sans-serif")
                    .attr("stroke", "#000")
                    .attr("fill", "#000")
                    .text(display_year);

                // Add population.
                svgBar.append("text")
                    .attr("x", coordinates[0] )
                    .attr("y", coordinates[1] + 30)
                    .attr("dy", "1em")
                    .attr("font-size", "11px")
                    .attr("id", "bar-value")
                    .attr("font-family", "sans-serif")
                    .attr("stroke", "#000")
                    .attr("fill", "#000")
                    .text(+d.Column.toFixed(3));
            })
            .on("mouseout", function(d) {
    
                // Remove country name.
                d3.select("#country-box").remove();
                // Remove country population title.
                d3.select("#bar-value").remove();
                d3.select("#year").remove();
            })
    
        // Update bar chart year.
        $("#year-legend-text").text(display_year);
    
    }

    // Error
    if (error) {
        
        console.log("Error occurred.");
        console.log(error);
        
    } else {

        // Convert each variable to numeric type and parse the date
        data.forEach(function(d) {
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
            d['Region'] = d['Forum classification'];
        });

        // Assign the data object loaded to the global dataset variable
        dataset = data;

        // Set the domains of the x and y scales using the data
        var max_gdp = d3.max(dataset, function(d) {
            return d.GDP;
        });
        var max_gci = d3.max(dataset, function(d) {
            return d.Global_Competitiveness_Index;
        });

        // Scales for scatter plot.
        xScale.domain([100, max_gdp + 100000]);
        yScale.domain([1, max_gci + 1]);

        // Set max population value for circle radii
        var max_pop = d3.max(dataset, function(d) {
            return d.Population;
        });
        
        // Scale scatter plot radii. 
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
        
        // Holds array of data for country trace functionality.
        var holdSet = [];
        
        function trailer(countryInput) {
        
            //var countryName = countryInput;
            var yearInternal = 2007;

            // Year function.
            function yearFilter2(value) {
                return (value.Year == yearInternal);
            }

            // Country function
            function countryFilter2(value) {
                return (value.Country == countryInput);
            }

            for(i = 0; i <= 12; i++) {
                var countryFilterData = dataset.filter(countryFilter2)
                var newData = svg.selectAll("circle").data(countryFilterData.filter(yearFilter2)); 
                holdSet.push(newData);
                yearInternal += 1;   
            }
    
        }
    
        // Generate the visualisation
        generateVis(false);
        
        // Runs loop for year.
        var currentYear = setInterval(stopStart, 2000);
        // Index for accessing trail nodes in holdSet array.
        var arrayIndex;
        
        // For looping through each year.
        function stopStart() {
            
            // Update year.
            display_year = display_year + 1;
            // Reset year.
            if (display_year > 2017) { 
                
                // Remove all nodes from canvas.
                d3.select('svg').selectAll('ellipse').remove();
                
                // Update display year.
                display_year = 2007;
                
                if (trail != false) {
                    // Calculate index.
                    arrayIndex = display_year - 2007;
                
                    // Generate trail visualisation.
                    generateVisTrail(holdSet[arrayIndex]);   
                }
                
            } else {
                
                if (trail != false) {
                    // Calculate index.
                    arrayIndex = display_year - 2007;
                   
                    // Generate trail visualisation.
                    generateVisTrail(holdSet[arrayIndex]);
                }
                
            }
            
            if (trail == false) {
                // Generate the visualisation
                generateVis(false);   
            } else {
                // Generate the visualisation
                generateVis(true);
            }
               
        }

        // Loop boolean check
        var playLoop = true;

        // Start/Stop code for looping through each year.
        $("#stopStartButton").click(function() {
            if (playLoop === true) {
                
                // Clear loop intervals, if running.
                clearInterval(currentYear);
                if (loopBars !== null) clearInterval(loopBars);
                if (comparisonCheck !== false) clearInterval(comparisonLoop);
                
                // Update button text and play indicator.
                $(this).text("Start");
                playLoop = false;
                
            } else {
                
                // Start scatter plot.
                currentYear = setInterval(stopStart, 2000);
                
                if (countryNameBarChart !== undefined) {
                
                    // If comparison bar chart is not running, run single bar chart.
                    if (comparisonCheck === false) {

                            loopBars = setInterval(function(){ generateVisBar(countryNameBarChart, display_year); }, 2000);  
                            
                    } else {

                            comparisonLoop = setInterval(countryComparison, 2000);
                            comparisonCheck = true;
                            console.log('fired');
    
                    }
                
                }
                
                // Update button text and play indicator.
                $(this).text("Stop");
                playLoop = true;
                
            }
        });

        // For selecting a specific year from dropdown.
        $(".yearSelect").click(function() {
            
            // Stop loop if running.
            if (playLoop === true) {
                clearInterval(currentYear);
                if (loopBars !== null) clearInterval(loopBars);
                playLoop = false;
                $("#stopStartButton").text("Start");
            }

            // Remove existing elements, particularly trailing elements.
            d3.select('svg').selectAll('circle').remove();
            d3.select("svg").selectAll("ellipse").remove();
            
            // Get year from box one canvas.
            display_year = parseInt($(this).text());
            
            // Generate the visualisations.
            generateVis(false);
            
            // Generate bar chart if previously running.
            if (countryNameBarChart !== undefined) {
                // Generate the visualisations.
                generateVisBar(countryNameBarChart, display_year);   
            }
            
        });
        
        // Select2 dropdown for selecting countries to compare against.
        // Has search functionality provided by select2.
        $("#countrySelect").select2({
            theme: 'bootstrap',
            width: '100%',
            containerCssClass: 'selectDrop',
            dropdownCssClass: 'selectDropMenu',
            placeholder: 'Compare Country'
        });
        
        // Hide Select2 country comparison by default as bar chart not in view on page load.
        $("#countrySelect").next(".select2-container").hide();
        
        // Select2 dropdown for selecting country to trace path on canvas.
        // Has search functionality provided by select2.
        $("#trailSelect").select2({
            theme: 'bootstrap',
            width: '100%',
            containerCssClass: 'selectDrop',
            dropdownCssClass: 'selectDropMenu',
            placeholder: 'Trace Path'
        });

        // On select2 change for country comparison.
		$("#countrySelect").on("select2:select", function() {
            
            // Get country name.
			selectedCountry = $("#countrySelect option:selected").text();
            
            // Stop bar chart loop.
            clearInterval(loopBars);
            
            if (playLoop === true) {
            
                // Comparison bar chart loop.
                comparisonLoop = setInterval(countryComparison, 2000);
                
            } else {
                
                // Comparison bar chart without loop.
                comparisonLoop = countryComparison();
                
            }
            
            // Set comparison indicator.
            comparisonCheck = true;
            
            // Show bar chart legend.
            $("#pill-box-two").css({"display": "block"});
            $("#pill-two-text").text(selectedCountry);
			
		});
        
        // Check if trail is checked or not.
        var trailChecked = false;
        
        // On select2 change for country trace.
		$("#trailSelect").on("change", function() {
            // Remove all existing nodes, including circles and ellipses.
            d3.select("svg").selectAll("circle").remove();
            d3.select("svg").selectAll("ellipse").remove();
            
            // Update canvas text.
            d3.select('svg').selectAll("#year_text")
                .attr("x", "300")
                .attr("y", "250")
                .text(function(d) {
                    return "Loading";
                });
            
            // Country name.
            countryNameTrail = $("#trailSelect option:selected").text();
            
            // Empty previous country data, if any.
            holdSet = [];
            
            // Create data for country to trace.
            trailer(countryNameTrail);
            trail = true;
            clearInterval(currentYear);
            currentYear = setInterval(stopStart, 2000);
            $("#toggle-box").show();
            trailChecked = true;
            
            // Update start/stop button
            if (playLoop === false) {
                $("#stopStartButton").text("Stop");
                playLoop = true;
            }
            
            // Update toggle switch back to on position.
            if ($('#toggle-input').prop('checked')) {
                $("#toggle-input").prop('checked', false);
            }
		});

        // Set for storing unique occurrences of countries in dataset.
        var countryList = new Set();

        // Loop through dataset, adding countries to set.
        for (i = 0; i < dataset.length; i++) {
            countryList.add(dataset[i]['Country']);
        }

        // Populate country comparison dropdown and country trail dropdown from country names in set.
        for (let item of countryList) {
            $("#countrySelect").append("<option value=" + item + ">" + item + "</option>");
            $("#trailSelect").append("<option value=" + item + ">" + item + "</option>");
        };
        
        // Hide/Show buttons in right box panel according to scroll position.
        $(window).scroll(function() {

            if ($(this).scrollTop() > 400) {
                $("#countrySelect").show();
                $('#countrySelect').next(".select2-container").show();
                $("#trailSelect").hide();
                $('#trailSelect').next(".select2-container").hide();
                $("#trailSelect").select2("close");
                $("#toggle-box").hide();
                if (loopBars !== null) {
                    $("#pill-box-one").show();
                    $("#year-legend").show();
                }
                if (comparisonCheck !== false) {
                    if ($("#pill-two-text").text() != "") {
                        $("#pill-box-two").show();   
                    }
                }
            } else {
                $("#countrySelect").hide();
                $('#countrySelect').next(".select2-container").hide();
                $("#countrySelect").select2("close");
                $("#trailSelect").show();
                $('#trailSelect').next(".select2-container").show();
                if (trailChecked == true) {
                    // Show toggle switch if trail feature selected.
                    $("#toggle-box").show();   
                }
                if (loopBars !== null) {
                    $("#pill-box-one").hide();
                    $("#year-legend").hide();
                }
                if (comparisonCheck !== false) {
                    $("#pill-box-two").hide();
                }
                
            }
            
        });
        
        // On switch change.
		$("#toggle-input").on("change", function() {
            if (trail == true) {
                trail = false;    
            } else {
                trail = true;
            }
            
            // Control for start/stop button.
            if (playLoop === true) {
                // Clear loop.
                clearInterval(currentYear);
                // Start fresh loop.
                currentYear = setInterval(stopStart, 2000);
            }
            
		});

    }

});