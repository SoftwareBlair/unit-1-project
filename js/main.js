$('document').ready(function() {
  console.log('Is main.js working?');

  const STYLES = 'styles?';

  $.ajax({
    headers: { Accept: 'application/json' },
    type: 'GET',
    url: URL + STYLES + KEY,
    crossDomain: true,
    beforeSend: function(xhr) {
      xhr.withCredentials = true;
    }
  }).done(function functionName(style) {
    // console.log(style);
    // Appends a beer style to Style of the Week Section
    $('#weeklyStyle').append(style.data[12].name + ' ' + '<small class="text-muted">ABV Range ' + style.data[12].abvMin + ' - ' + style.data[12].abvMax + '</small>');
    $('.discribe').append(style.data[12].description);
  }).fail(function(err) {
    console.log(err);
  });

  // Poplulates Select Options on Events Section on home page
  for (var i in STATES) {
    $('#state').append('<option value="' + STATES[i] + '">' + STATES[i] + '</option>');
  }
});

$('#searchBtn').click(function(event) {
  event.preventDefault();
});
