function generateVis(dataset) {

        // Filter data for year.
        var data_filtered = dataset.filter(yearFilter);

        /******** HANDLE UPDATE SELECTION ************/
        svg.selectAll("circle")
            .data(data_filtered)
            .transition()
            .duration(500)
            .ease(d3.easeCubic)
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
            .attr("r", function(d, i) {
                if (d.Population !== 0) {
                    return radiusScale(+d.Population);
                }
            })
            .attr("id", function(d) {
                return d.Country;
            })
            .style("fill", function(d, i) {
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
            .attr("r", function(d, i) {
                if (d.Population !== 0) {
                    return radiusScale(+d.Population);
                }
            })
            .attr("id", function(d) {
                return d.Country;
            })
            .style("fill", function(d, i) {
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

                // Clear canvas
                createBarCanvas();
                d3.select("svgBar").remove();

                // Generate Bar Chart


                // Runs loop for bars.
                var loopBar = setInterval(loopBars, 2000);

                // For looping through each year.
                function loopBars() {
                    // Generate the visualisation
                    generateVisBar(d.Country, display_year);
                }
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