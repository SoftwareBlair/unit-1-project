$('document').ready(function() {
  console.log('Is map.js working?');

  google.charts.load('current', { packages: ['geochart'] });

  google.charts.setOnLoadCallback(beerMapUS);

  function beerMapUS() {

    const LOCATION = 'locations?region=';

    // AJAX call to pull information by state
    var stateData = function createStateArray(state) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          headers: { Accept: 'application/json' },
          type: 'GET',
          url: URL + LOCATION + state + KEY,
          crossDomain: true,
          beforeSend: function(xhr) {
            xhr.withCredentials = true;
          }
        }).done(function statesArray(state) {
          // Finds Brewery Address and Name
          for (let i = 0; i < state.data.length; i++) {
            var brewAddress = (state.data[i].streetAddress + ', ' + state.data[i].locality + ', ' + state.data[i].region);
            var brewName = state.data[i].brewery.name;
            var brewArr = [];
            brewArr.push(brewAddress, brewName);
            console.log(brewArr);
          }
          // Pushes States and the number for breweries per state into an array
          var statesBreweryCount = [];
          statesBreweryCount.push(state.data[0].region, state.totalResults);
          resolve(statesBreweryCount);
          // console.log(statesBreweryCount);
        }).fail(function(err) {
          reject(err);
        });
      });
    };

    // Fires the createMap function when data is loaded from API
    var mapReq = Promise.all(STATES.map(stateData)).then(function(data) {
      // Remove Beer Tap Load Indicator
      $('#beerload').css('display', 'none');
      // Create Map With Data Values Inputed
      createMapUS(data);
    });

    // Initial Table Data to create US map
    function createMapUS(statesArr) {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'State');
      data.addColumn('number', 'Total Number of Breweries');
      data.addRows(statesArr);

      // Map styling opitons
      var options = {
        region: 'US',
        resolution: 'provinces',
        displayMode: 'regions',
        width: 1080,
        hieght: 600,
        colorAxis: { colors: ['#0CEFFF', '#033C40'] },
        legend: 'none'
      };

      // Draws Map to the Dom
      var viewUS = new google.visualization.GeoChart(document.getElementById('beerMapUS'));
      viewUS.draw(data, options);

      var statesView = new google.visualization.GeoChart(document.getElementById('beerMapUS'));
      statesView.draw(data, options);

      google.visualization.events.addListener(statesView, 'regionClick', function(eventData) {
        // Makes Button Visible when zoomed into a state
        $('#resetButton').css('visibility', 'visible');
        // Sets New options at indvidual state view
        options.region = eventData.region;
        options.resolution = 'provinces';
        options.displayMode = 'markers';
        options.defaultColor = '#0CEFFF';

        var data = new google.visualization.arrayToDataTable([
          ['Address', 'Brewery'],
          ['3001 Walnut St, Denver, Colorado', 'Epic Brewing Company'],
          ['1756 Lake Woodmoor Dr, Monument, Colorado', 'Pikes Peak Brewing Company'],
          ['304 E Hopkins Ave, Aspen, Colorado', 'Aspen Brewing Company'],
          ['1960 N 12th St, Grand Junction, Colorado', 'Kannah Creek Brewing Company']
        ]);

        statesView.draw(data, options);

        $('#resetButton').click(function() {
          createMapUS(statesArr);
          $('#resetButton').css('visibility', 'hidden');
        });

      });

    }
  }

});

const URL = 'https://galvanize-cors-proxy.herokuapp.com/http://api.brewerydb.com/v2/';
const KEY = '&key=7ade4b89c290b6e98d58ba83b1f17695&format';

const STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'];
