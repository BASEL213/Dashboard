function fetchDataAndUpdateChart2() {
    fetch("/data_index2")
    .then((response) => response.json())
    .then((data) => {
      updateChart2(data);
    })
    .catch((error) => console.error("Error:", error));
}

function updateChart2(data_df) {
  console.log(data_df);
  try {
    // Create root element
    var root = am5.Root.new("chartdiv"); /*bars*/
    
    // Set themes
    root.setThemes([
    am5themes_Animated.new(root)
    ]);
    
    // Create chart
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true,
    paddingLeft:0,
    paddingRight:1
    }));
    
    // Add cursor
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, { 
    minGridDistance: 0, 
    minorGridEnabled: true
    });
    
    xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
    });
    
    xRenderer.grid.template.setAll({
    location: 1
    })
    
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "major",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
    }));
    
    var yRenderer = am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
    })
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: yRenderer
    }));
    
    // Create series
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "major",
    tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
    })
    }));
    
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    series.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    xRenderer.labels.template.setAll({
        fill: am5.color("#ffffff")
    });
    
    yRenderer.labels.template.setAll({
        fill: am5.color("#ffffff")
    });
    xRenderer.grid.template.setAll({
        stroke: am5.color("#ffffff"),
        // Adjust opacity if desired:
        // strokeOpacity: 0.5
    });
    
    yRenderer.grid.template.setAll({
        stroke: am5.color("#ffffff"),
        // Adjust opacity if desired:
        // strokeOpacity: 0.5
    });
    
    
    // Set data
    xAxis.data.setAll(data_df);
    series.data.setAll(data_df);
    
    
    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);
  } catch (e) {
    console.log(e);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndUpdateChart2();
});