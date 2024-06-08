function fetchDataAndUpdateChart1() {
  fetch("/data_index1")
    .then((response) => response.json())
    .then((data) => {
      updateChart1(data);
    })
    .catch((error) => console.error("Error:", error));
}
function updateChart1(data_df) {
    console.log(data_df);
  try {
    var root = am5.Root.new("chartdiv1");

    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    var series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "percent",
        categoryField: "type",
        fillField: "color",
        alignLabels: false,
      })
    );

    series.slices.template.set("templateField", "sliceSettings");
    series.labels.template.set("radius", 30);

    // Set up click events
    series.slices.template.events.on("click", function (event) {
      if (event.target.dataItem.dataContext.id !== undefined) {
        selected = event.target.dataItem.dataContext.id;
        series.data.setAll(generateChartData(selected));
      } else {
        selected = undefined;
        series.data.setAll(generateChartData());
      }
    });

    var selected;

    // Initial data set
    series.data.setAll(generateChartData());

    // Slice labels
    series.labels.template.setAll({
      fill: am5.color("#ffffff"),
    });

    function generateChartData(selectedIndex) {
      var chartData = [];
      for (var i = 0; i < data_df.length; i++) {
        if (i === selectedIndex) {
          for (var x = 0; x < data_df[i].subs.length; x++) {
            chartData.push({
              type: data_df[i].subs[x].type,
              percent: data_df[i].subs[x].percent,
              color: data_df[i].color,
              pulled: true,
              sliceSettings: {
                active: true,
              },
            });
          }
        } else {
          chartData.push({
            type: data_df[i].type,
            percent: data_df[i].percent,
            color: data_df[i].color,
            id: i,
          });
        }
      }
      return chartData;
    }
  } catch (e) {
    console.log(e);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndUpdateChart1();
});


