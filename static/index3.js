function fetchDataAndUpdateChart3() {
  fetch("/data_index3")
    .then((response) => response.json())
    .then((data) => {
      updateChart3(data);
    })
    .catch((error) => console.error("Error:", error));
}

function updateChart3(data_df) {
  console.log(data_df);
  try {
    // Create root element
    var root = am5.Root.new("chartdiv3");

    root.numberFormatter.setAll({
      numberFormat: "#a",

      // Group only into M (millions), and B (billions)
      bigNumberPrefixes: [
        { number: 1e6, suffix: "M" },
        { number: 1e9, suffix: "B" },
      ],

      // Do not use small number prefixes at all
      smallNumberPrefixes: [],
    });

    var stepDuration = 2000;

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
      })
    );

    // We don't want zoom-out button to appear while animating, so we hide it at all
    chart.zoomOutButton.set("forceHidden", true);

    // Create axes
    var yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 20,
      inversed: true,
      minorGridEnabled: true,
    });
    // hide grid
    yRenderer.grid.template.set("visible", false);

    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "network",
        renderer: yRenderer,
      })
    );

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        strictMinMax: true,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    xAxis.set("interpolationDuration", stepDuration / 10);
    xAxis.set("interpolationEasing", am5.ease.linear);

    // Add series
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "value",
        categoryYField: "network",
      })
    );

    // Rounded corners for columns
    series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });

    // Make each column to be of a different color
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    // Add label bullet
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueXWorking.formatNumber('#.# a')}",
          fill: root.interfaceColors.get("alternativeText"),
          centerX: am5.p100,
          centerY: am5.p50,
          populateText: true,
        }),
      });
    });

    var label = chart.plotContainer.children.push(
      am5.Label.new(root, {
        text: "2017",
        fontSize: "8em",
        opacity: 0.2,
        x: am5.p100,
        y: am5.p100,
        centerY: am5.p100,
        centerX: am5.p100,
      })
    );

    // Get series item by category
    function getSeriesItem(category) {
      for (var i = 0; i < series.dataItems.length; i++) {
        var dataItem = series.dataItems[i];
        if (dataItem.get("categoryY") == category) {
          return dataItem;
        }
      }
    }

    // Axis sorting
    function sortCategoryAxis() {
      // sort by value
      series.dataItems.sort(function (x, y) {
        return y.get("valueX") - x.get("valueX"); // descending
        //return x.get("valueX") - y.get("valueX"); // ascending
      });

      // go through each axis item
      am5.array.each(yAxis.dataItems, function (dataItem) {
        // get corresponding series item
        var seriesDataItem = getSeriesItem(dataItem.get("category"));

        if (seriesDataItem) {
          // get index of series data item
          var index = series.dataItems.indexOf(seriesDataItem);
          // calculate delta position
          var deltaPosition =
            (index - dataItem.get("index", 0)) / series.dataItems.length;
          // set index to be the same as series data item index
          if (dataItem.get("index") != index) {
            dataItem.set("index", index);
            // set deltaPosition instanlty
            dataItem.set("deltaPosition", -deltaPosition);
            // animate delta position to 0
            dataItem.animate({
              key: "deltaPosition",
              to: 0,
              duration: stepDuration / 2,
              easing: am5.ease.out(am5.ease.cubic),
            });
          }
        }
      });
      // sort axis items by index.
      // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
      yAxis.dataItems.sort(function (x, y) {
        return x.get("index") - y.get("index");
      });
    }

    var year = 2017;

    // update data with values each 1.5 sec
    var interval = setInterval(function () {
      year++;

      if (year > 2023) {
        clearInterval(interval);
        clearInterval(sortInterval);
      }

      updateData();
    }, stepDuration);

    var sortInterval = setInterval(function () {
      sortCategoryAxis();
    }, 100);

    function setInitialData() {
      var d = data_df[year];

      for (var n in d) {
        series.data.push({ network: n, value: d[n] });
        yAxis.data.push({ network: n });
      }
    }

    function updateData() {
      var itemsWithNonZero = 0;

      if (data_df[year]) {
        label.set("text", year.toString());

        am5.array.each(series.dataItems, function (dataItem) {
          var category = dataItem.get("categoryY");
          var value = data_df[year][category];

          if (value > 0) {
            itemsWithNonZero++;
          }

          dataItem.animate({
            key: "valueX",
            to: value,
            duration: stepDuration,
            easing: am5.ease.linear,
          });
          dataItem.animate({
            key: "valueXWorking",
            to: value,
            duration: stepDuration,
            easing: am5.ease.linear,
          });
        });

        yAxis.zoom(0, itemsWithNonZero / yAxis.dataItems.length);
      }
    }

    // Override axis grid and label colors
    root.interfaceColors.set("grid", am5.color(0xffffff));
    root.interfaceColors.set("text", am5.color(0xffffff));


    setInitialData();
    setTimeout(function () {
      year++;
      updateData();
    }, 50);

    // Make stuff animate on load

    series.appear(1000);
    chart.appear(1000, 100);
  } catch (e) {
    console.log(e);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndUpdateChart3();
});
