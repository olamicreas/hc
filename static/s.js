var time;
var day;
var month;
var year;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var center;

// remove border if the selected date is today's date
function todayEqualActive(){
  setTimeout(function(){
    if($(".ui-datepicker-current-day").hasClass("ui-datepicker-today")){
      $(".ui-datepicker-today")
        .children(".ui-state-default")
        .css("border-bottom", "0");
    }
    else{
      $(".ui-datepicker-today")
        .children(".ui-state-default")
        .css("border-bottom", "2px solid rgba(53,60,66,0.5)");
    }
  }, 20);
}

// call the above function on document ready
todayEqualActive();

$('#calendar').datepicker({
  inline: true,
  firstDay: 1,
  showOtherMonths: true,
  onChangeMonthYear: function(){
    todayEqualActive();
  },
  onSelect: function(dateText, inst){
    var date = $(this).datepicker('getDate'),
    day  = date.getDate(),
    month = date.getMonth() + 1,
    year =  date.getFullYear();
    
    // display selected date on submit button
    var monthName = months[month - 1];
    $(".request .day").text(monthName + " " + day);

    // Set values to hidden input fields
    $('#selectedDay').val(day);
    $('#selectedMonth').val(month);
    $('#selectedYear').val(year);
    
    todayEqualActive();
    $(".request").removeClass("disabled");

    // Create the timepicker placeholder below the selected date row
    var index;
    setTimeout(function(){
       $(".ui-datepicker-calendar tbody tr").each(function(){
        if($(this).find(".ui-datepicker-current-day").length){
          index = $(this).index() + 1;
        }
      });

      $("<tr class='timepicker-cf'></tr>").insertAfter($(".ui-datepicker-calendar tr").eq(index));

      var top = $(".timepicker-cf").offset().top - 2;
      $(".timepicker").css('top', top);
      $(".timepicker, .timepicker-cf").animate({'height': '60px'}, 200);
    }, 0);

    // Display selected time
    time = $(".owl-stage .center").text();
    $(".request .time").text(time);

    // Set time to hidden input field
    $('#selectedTime').val(time);

    // Centering owl carousel items
    $(".owl-item").removeClass("center-n");
    center = $(".owl-stage").find(".center");
    center.prev("div").addClass("center-n");
    center.next("div").addClass("center-n");
  }
});

// Update time on owl carousel navigation (next and previous buttons)
$(".timepicker").on('click', '.owl-next, .owl-prev', function(){
  time = $(".owl-stage .center").text();
  $(".request .time").text(time);

  // Update hidden input for time
  $('#selectedTime').val(time);

  $(".owl-item").removeClass("center-n");
  center = $(".owl-stage").find(".center");
  center.prev("div").addClass("center-n");
  center.next("div").addClass("center-n");
});

// Initialize owl carousel for time selection
$('.owl').owlCarousel({
  center: true,
  loop: true,
  items: 5,
  dots: false,
  nav: true,
  navText: " ",
  mouseDrag: false,
  touchDrag: true,
  responsive: {
    0: {
      items: 3
    },
    700: {
      items: 5
    },
    1200: {
      items: 7
    }
  }
});

// Add custom animations for datepicker's next and previous buttons
$(document).on('click', '.ui-datepicker-next, .ui-datepicker-prev', function(e){
  $(".timepicker-cf").hide(0);
  $(".timepicker").css({'height': '0'});
  e.preventDefault();
  $(".ui-datepicker").animate({
    'transform': $(this).hasClass('ui-datepicker-next') ? "translateX(100%)" : "translateX(-100%)"
  }, 200);
});

// On window resize, adjust the timepicker's position
$(window).on('resize', function(){
  $(".timepicker").css('top', $(".timepicker-cf").offset().top - 2);
});

// Handle input label focus
$(".form-name input").each(function(){
  $(this).keyup(function(){
    if (this.value) {
      $(this).siblings("label").css({
        'font-size': '0.8em',
        'left': '.15rem',
        'top': '0%'
      });
    } else {
      $(this).siblings("label").removeAttr("style");
    }
  });
});


$('form').on('submit', function(e) {
  // Get the values from the hidden inputs
  var selectedDay = $('#selectedDay').val();
  var selectedMonth = $('#selectedMonth').val();
  var selectedYear = $('#selectedYear').val();
  var selectedTime = $('#selectedTime').val();

  // Check if both date and time are selected
  if (!selectedDay || !selectedMonth || !selectedYear || !selectedTime) {
    alert('Please select both a date and time before submitting.');
    e.preventDefault(); // Prevent form submission
  }
});