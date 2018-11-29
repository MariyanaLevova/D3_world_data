#D3_world_data
 
 This page displays infomation on Global Competitive Index from a raw csv file.
 
 Functionality:
 1. A scatter plot:
 	- displays individual countries' GDP and GCI on the x and y axes respectively.
	- each country's population is encoded with the bubble size.
	- each bubble has an "on hover" option to display the population as a number for the current year.
	- the bubbles are colour encoded by region and a region legend is available directly below the scatter plot.
	- all colours used are selected from the ColorBrewer2 palette.
	- a black background is chosen for the scatter plot for improved visibility as suggested by this thread            https://ux.stackexchange.com/questions/8153/what-are-the-negative-and-positive-aspects-of-dark-color-scheme?fbclid=IwAR1PZRv6tEF06DGvSvVH1Bl5ystfnGkzLxa3LyhEryp8sn0Jrxg1W8snzDc
	- a navigation bar on the right hand-side allows for extra functionality.
	- the scatter plot is set to automatically loop through the years and a stop/start button allows a user to pause this loop.
	- a specific year can be selected from a drop-down menu and this causes the loop to pause on the chosen year. This can be restarted by the stop/start button.
	- a button to "Trace Path" allows to select a particular country and see its progress over time.
	- the trace can be turned on or off with a slider button.
	- each bubble is clickable and on click it generates a bar chart for the selected country. This bar chart is displayed below the scatter plot.
	
2. Bar Chart (single country)
	- the bar chart displays the 12 competitive index pillars for the selected country.
	- the bar chart is automatically looping through the years and this can be controlled with the start/stop button.
	- a specific year can be selected and paused on for further examination of the bars.
	- a legend displays the country and year displayed in the chart.
	- the x-axis bears the name for each pillar and the y-axis denotes the pillar values.
	- on hover, each pillar displays the value of the pillar for the corresponding year in a white box, if the white box disappears it means that the bar has changed its value for a different year.
	- a "Compare Country" button is available in the navigation panel which triggers the comparison bar chart.
	
3. Bar Chart (country comparison)
	- the chart displays 24 bars, one for each pillar for each country.
	- the bar chart is automatically looping through the years and this can be controlled with the start/stop button.
	- a specific year can be selected and paused on for further examination of the bars.
	- the bars are colour coded to distinguish between the two countries in the format "country X pillar 1, country Y pillar 1, country X pillar 2, country Y pillar 2 etc".
	- a legend displays the countries and year displayed in the chart.
	- the x-axis bears the name for each pillar and the y-axis denotes the pillar values.
	- on hover, each pillar displays the value of the pillar for the corresponding year in a white box, if the white box disappears it means that the bar has changed its value for a different year.
	- the "Compare Country" button is still functioning and allows to draw a new comaprison with the original country selected from the scatter plot.
    
    
Multivariate comparison strategy
    The bar chart filters the original dataset based on the country value selected from the scatter plot and the year. Once this filter is applied, the country rows are extracted from the dataset. Following this, a for loop is applied that runs through each column/pillar and creates an array that holds objects denoting each pillar value. The loop does not distinguish between column names as they are passed as annonymous entities in the form of key-value pairs where key = "Column" for all columns and value = the value asscoiated with each pillar. This allows D3.js to iterate through one row 12 times and plot 12 separate bars.(see line 720 in main.js for single bar chart implementation)
    
    The same strategy is applied for the comparison bar chart with a few adaptations. Firstly, two separate filters are applied, to extract data for both countries. Following this, each loop iteration is now pushing two values at a time, one from each country in the format "country X pillar 1, country Y pillar 1, country X pillar 2, country Y pillar 2 etc". The values in this new array (24 of them) are then plotted using the same strategy as the single country bar chart. (see line 890 in main.js for comparison implementation)
    
    
