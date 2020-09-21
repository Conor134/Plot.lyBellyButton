function optionChanged(newSubject) {
  // Fetch new data each time a new sample is selected
  updateCharts(newSubject);
  updateSubjectData(newSubject);
  initDropdown(newSubject);
}
// Initalise the fist page withthe charts and table fromt eh first value
var firstSubject = "940"
optionChanged(firstSubject);

// Initalise Dropdown
function initDropdown() {
  d3.json("../data/samples.json").then((importedData) => {

    var idSubjects = importedData.names;
    var firstSubject = idSubjects[0];
    // console.log(idSubjects[0])
    var firstSubject = idSubjects[0];


    var idSelector = d3.select("#selDataset");
    idSubjects.forEach((x) => {
      idSelector.append("option").text(x).property("value", x);}
    )});


}

// Update subject data
function updateSubjectData(newSubject) {
d3.json("../data/samples.json").then((importedData) => {
  var data = importedData;
  console.log()

// Update Demographic info table
  var demog_info = importedData.metadata.filter(x => x.id == newSubject);
  // console.log(demog_info)
  var demogPanel = d3.select("#sample-metadata");
 
  var looped = demog_info[0];
  demogPanel.html("");
  // console.log(looped)
  Object.entries(looped).forEach(([key, value]) => {
    demogPanel.append("h6").text(`${key}: ${value}`);
    })
});
}

//  Update the charts with data from selected ID
function updateCharts(newSubject) {
  d3.json("../data/samples.json").then((data) => {
    // initializing data
    // var samples = data.samples;
    var meta = data.metadata.filter(x => x.id == newSubject);
    var data = data.samples.filter(x => x.id == newSubject);
    // console.log(data);
    // console.log(data[newSubject]);
    
    var looped = data[0]
    sample_values = looped.sample_values;
    // console.log(sample_values);

    var sample_values_bubble = looped.sample_values;
    var otu_ids = looped.otu_ids;
    var otu_ids_bubble = looped.otu_ids;
    var otu_labels = looped.otu_labels;
    var otu_labels_bubble = looped.otu_labels;
    var looped_wash = meta[0]
    var washfreq = looped_wash.wfreq;

    // BAR CHART******************************
    // // Slice the first 10 objects for plotting
    sample_values = sample_values.slice(0, 10).reverse();
    otu_ids = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    otu_labels = otu_labels.slice(0, 10).reverse();
      // Trace1 for the bar chart
    var trace1 = {
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      name: "BellyBar",
      type: "bar",
      orientation: "h"
    };
    // Bar data
    var chartData = [trace1];
    // Apply the group bar mode to the layout
    var layout = {
      title: `Top 10 OTUs found for individual ${newSubject}`,
      margin: { l: 100, r: 100, t: 100, b: 100 }
    };
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData, layout);

    // BUBBLE CHART******************************
   // Trace2 for the Bubble chart
    var trace2 = {
        x: otu_ids_bubble,
        y: sample_values_bubble,
        text: otu_ids_bubble,
        mode: 'markers',
        marker: {
            size: sample_values_bubble,
            color: otu_ids_bubble,
            colorscale:"Electric" 
        },
        name: "BellyBubble",
        };
      // Bubbble data
      var bubbleData = [trace2];
      // Apply the group bar mode to the layout
      var bubble_layout = {
        title: `All OTUs found for individual ${newSubject}`,
        margin: { l: 100, r: 100, t: 100, b: 100}, 
        height: 600,
        width: 1200  
      }
      Plotly.newPlot("bubble", bubbleData, bubble_layout);

  // Gauge Chart CHART******************************
   // Trace3 for the gauge chart

   var trace3 = {

    domain: { x: [0, 1], y: [0, 1] },
		value: washfreq,
		title: { text: "Speed" },
		type: "indicator",
    mode: "gauge+number",
    title: { text: `Belly Button Wash Frequency for individual ${newSubject}` },
		type: "indicator",
        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] } }
   }

    
  // Gauge data
  var gauge_Data = [trace3];
  // Apply the group bar mode to the layout
  var gauge_layout = { width: 600, 
    height: 500, 
    margin: { t: 0, b: 0 } };

  Plotly.newPlot("gauge", gauge_Data, gauge_layout);

  });
}

initDropdown();