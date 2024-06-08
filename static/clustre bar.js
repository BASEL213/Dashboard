function fetchDataAndUpdateChart() {
  fetch("/clustre_bar_data")
    .then((response) => response.json())
    .then((data) => {
      updateChart(data);
    })
    .catch((error) => console.error("Error:", error));
}

function updateChart(data_df) {
  console.log(data_df);
  try {
    // Create root element
    var root = am5.Root.new("clustre_bar"); // clustre bar
    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );
    // Add legend
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // Create axes
    var xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
    });

    var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.grid.template.setAll({
      location: 1,
    });

    xAxis.data.setAll(data_df);

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    );

    // Add series
    function makeSeries(name, fieldName) {
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "year",
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
      });

      series.data.setAll(data_df);

      // Make stuff animate on load
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      legend.data.push(series);
    }

    makeSeries("CSAI", "CSAI");
    makeSeries("Science", "Science");
    makeSeries("Engineering", "Engineering");
    makeSeries("Busniess", "Busniess");



    // Override axis grid and label colors
    root.interfaceColors.set("grid", am5.color(0xffffff));
    root.interfaceColors.set("text", am5.color(0xffffff));

    // Make stuff animate on load
    chart.appear(1000, 100);
  } catch (e) {
    console.log(e);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndUpdateChart();
});
