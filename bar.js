// Function to generate canvas for Bar Chart
function createBarCanvas() {
        // SVG canvas settings


        //Create SVG element as a group with the margins transform applied to it
        svgBar = d3.select("#box-two")
            .append("svg")
            .attr("width", svg_width + margin.left + margin.right)
            .attr("height", svg_height + margin.top + margin.bottom + 200)
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
            .tickFormat(xAxisBarChart);

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
            .call(xAxisBar)
            .append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("stroke", "#000")
            .attr("fill", "#000")
            .attr("x", "440")
            .attr("y", "40")
            .attr("dy", ".15em");
        //    .text("12 Pillars");

        // Create the y axis
        svgBar.append("g")
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

        // SVG canvas background - makes first bar disappear
        /**svgBar.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("fill", "#000")
            .attr("height", "425px")
            .attr("width", "925px");*/

        // SVG canvas year
        svgBar.append("text")
            .attr("x", "0")
            .attr("y", "0")
            .attr("dy", "1em")
            .attr("font-size", "100px")
            .attr("font-family", "sans-serif")
            .attr("stroke", "#fff")
            .attr("id", "year_text")
            .text(display_year);

    }


// Function to generate Bar Chart
    function generateVisBar(country, year) {

        //console.log(country, year);


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
        //console.log(country_filtered);

        // Loop through every element in the filtered dataset and add to array dataHold
        // Doing this because otherwise the D3 functions only run once.
        // The arrayHold will hold 12 objects each composed of one of the columns from the CSV
        // The D3 functions will use arrayHold              // They will now iterate 12 times - one iteration for each column.

        dataHold = []
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
        console.log(dataHold);

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
            .transition()
            .duration(500)
            .ease(d3.easeCubic)
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
                    return "#74add1";
                } else {
                    return "#4575b4";
                }
            });

        /******** HANDLE UPDATE SELECTION ************/
        // Append the rectangles for the bar chart

        bars
            .transition()
            .duration(500)
            .ease(d3.easeCubic)
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
                    return "#74add1";
                } else {
                    return "#4575b4";
                }
            });

        /******** HANDLE EXIT SELECTION ************/
        // Remove bars that no longer have a matching data element
        bars.exit()
            .style("fill", "Red")
            .transition()
            .duration(500)
            .attr("r", 0)
            .remove();

        // Changes year on svg canvas.
        svgBar.selectAll("#year_text")
            .data(country_filtered)
            .text(function(d) {
                return d.Year + " " + d.Country;
            });

        // Controls the text labels at the top of each bar. 
        var barValues = svgBar.selectAll("#label")
            .data(dataHold)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", (function(d) {
                return xScaleBar(d.Column) + 5;
            }))

            .attr("y", function(d) {
                return yScaleBar(d.Column) - 12;
            })
            .attr("dy", ".75em")
            .text(function(d) {
                return d.Column.toFixed(3);
            });

        barValues.transition()
            .duration(500)
            .ease(d3.easeCubic)
            .attr("class", "label")
            .attr("x", (function(d) {
                return xScaleBar(d.Column) + 5;
            }))

            .attr("y", function(d) {
                return yScaleBar(d.Column) - 12;
            })
            .attr("dy", ".75em")
            .text(function(d) {
                return d.Column.toFixed(3);
            });

        // This is not working i.e. the bar labels are not getting removed
        barValues.exit()
            .style("fill", "Red")
            .transition()
            .duration(500)
            .attr("x", 0)
            .attr("y", 0)
            .remove();

    }