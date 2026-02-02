//setup some default options for bar chart
var barchartOptions;
var piechartOptions; 
var stackedbarOptions;
var linechartOptions;
var gaugechartOptions;

   gaugechartOptions = {

        chart: {
            type: 'solidgauge',
            renderTo: 'gauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {     
            min: 0,
            max: 200,
            title: {
                text: 'Count' 
                },  
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

   credits: {
            enabled: false
        },

        series: [{
            name: 'Count',
            data: [80],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">km/h</span></div>'
            },
            tooltip: {
                valueSuffix: 'Requests'
            }
        }],        

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        } 

    }

    





linechartOptions = {


            chart: {

                renderTo: 'aflaChart',
                type: 'line',
                zoomType: 'xy'
            },
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'UNIFlow',
                x: -20
            },
            credits: {
                enabled: false
            },            
            exporting: {
                enabled: true
            },            
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                title: {
                    enabled: true,
                    text: 'Months'
                },
                labels: {
                    rotation: 0
                },
              plotLines: [{
                  color: 'transparent',
                  width: 2,
                  value: 3,
                  label: {
                      text: ''                    
                      },
                  zIndex: 4                  
              }]                 

            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 2,
                    width: 3,
                    color: 'transparent',
                    zIndex: 3
                }],
                plotBands: [{
                        zIndex:2,
                        color: 'transparent',
                        from: 0,
                        to: 0.001                               
                    }],
                },
            tooltip: {
                enabled: true,
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }, 
                    series: {
                        cursor: 'pointer',
                         point: {
                            events: {
                                click: function () {
                                    alert('Category: ' + this.category + ', value: ' + this.y);
                                }
                            }
                         }
                    },                                       
                    enableMouseTracking: true
                }                

            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }]

}



  lineBarOptions = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Cost & Quantity Over Time Period'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        credits: {
            enabled: false
        },            
        exporting: {
            enabled: true
        },          
        xAxis: [{
            categories: []
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '$ {value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Cost',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Qty',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 0 ,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
         
        series: [{
            name: 'Rainfall',
            type: 'spline',
            yAxis: 1,
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            tooltip: {
                valueSuffix: ' mm'
            }

        }, {
            name: 'Temperature',
            type: 'column',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            tooltip: {
                valueSuffix: '°C'
            }
        }]
  }


barchartOptions = {
  chart: {
    height: 200,
    renderTo: 'container1',
    defaultSeriesType: 'column',
  },
  credits: {
      enabled: false
  },            
  exporting: {
      enabled: true
  },    
  title: {text: 'Number of containers by type'},
  subtitle: {text: ''},
  xAxis: {
    categories: [],
    title: {text: 'container Type'},
    labels: { rotation: -60 }
  },
  yAxis: { // left y axis
    title: {text: 'Total Found'},
    /*legend: {
      layout: 'vertical',
      backgroundColor: '#FFFFFF',
      align: 'left',
      verticalAlign: 'top',
      x: 100,
      y: 70,
      floating: true,
      shadow: true
    },*/
  },
  /*legend: {
    align: 'left',
    verticalAlign: 'top',
    y: 20,
    floating: true,
    borderWidth: 0
  },*/
    tooltip: {shared: true,crosshairs: true},
    plotOptions: {
      column: {colorByPoint: true},
      bar: {colorByPoint:true},
      series: {
              dataLabels: {
                enabled: true,
                align: 'center',
                color: '#000000',
                y: 15
                },
             cursor: 'pointer',
             point: {
             events: {
               click: function() {
                 hs.htmlExpand(null, {
                   pageOrigin: {x: this.pageX,y: this.pageY},
                   headingText: this.series.name,
                   width: 200
            });
          }
        }
      },
      marker: {lineWidth: 1}
    }
  },
  series: [{ name: 'Containers',data: []}]
}
//-------------------------------------------------
//setup default options for pie chart

piechartOptions = {

  chart: {
    height: 200,
    renderTo: 'container2',
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
  },
  credits: {
      enabled: false
  },            
  exporting: {
      enabled: true
  },    
  colors: {
      radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
      stops: [
        [0, '#003399'],
        [1, '#3366AA']
            ]
        },  
  tooltip: {
    formatter: function() {
      return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage,2) +' %';
    }
  },
  title: {
    text: 'User Activity on system'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',

      dataLabels: {
        enabled: true,
        color: '#000000',
        connectorColor: 'silver',
        formatter: function() {
          return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage,2) +' %';
        }
      }, showInLegend: true
    }
  },
  series: [{
    type: 'pie',
    name: 'Users',
    data: []
  }]
}
//-------------------------------------------------
//setup default options for pie chart
stackedbarOptions = {
  chart: {
    height: 200,
    renderTo: 'container1',
    defaultSeriesType: 'column',
  },
  title: {text: '--'},
  subtitle: {text: 'Source: UNIFLOW'},
  xAxis: {
    categories: [],
    title: {text: 'n/a'}
  },
  yAxis: { // left y axis
    title: {text: 'n/a'},
    legend: {
      layout: 'vertical',
      backgroundColor: '#FFFFFF',
      align: 'left',
      verticalAlign: 'top',
      x: 100,
      y: 70,
      floating: true,
      shadow: true
    },
  },
  legend: {
    align: 'left',
    verticalAlign: 'top',
    y: 20,
    floating: true,
    borderWidth: 0
  },
    tooltip: {shared: true,crosshairs: true},
    plotOptions: {
    series: {
      stacking: 'normal'
    }
  },
  series: [
    {
      name: 'series 1',
      data: [5, 3, 4, 7, 2]
    },
    {
      name: 'series 1',
      data: [2, 2, 3, 2, 1]
    },
  ]
}
      