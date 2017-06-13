var events = [];

var date = new Date();

var days;

var n_year = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var l_year = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var transition_time = 5;
var transition_frame = 0;
var current_event = 0;
var event_count = 0;

var c_day = new Date().getDate();

init_time();

setInterval(update_time, 1000);

function init_time(){
    loadEvents();
}

function update_time(){
    transition_frame++;
    if(transition_frame > transition_time){
        transition_frame = 0;

        current_event++;
        if(current_event >= events.length){
            current_event = 0;
        }
    }

    date = new Date();

    if(c_day != date.getDate()){
        for(var i = 0; i < events.length; i++){
            events[i].days--;
        }

        c_day = date.getDate();
    }

    getById("image").src = events[current_event].event_image;
    getById("event_name").innerHTML = events[current_event].event_name;
    getById("days").innerHTML = zFill(events[current_event].days + "", 5);
    getById("hrs").innerHTML = zFill(23 - date.getHours() + "", 2);
    getById("mins").innerHTML = zFill(59 - date.getMinutes() + "", 2);
    getById("secs").innerHTML = zFill(59 - date.getSeconds() + "", 2);

    loadColourScheme();
}

function loadColourScheme() {
    document.body.style.backgroundColor = events[current_event].background_colour;

    getById("stats").style.backgroundColor = events[current_event].banner_colour;

    getById("days").style.backgroundColor = events[current_event].banner_colour;
    getById("mins").style.backgroundColor = events[current_event].banner_colour;
    getById("hrs").style.backgroundColor = events[current_event].banner_colour;
    getById("secs").style.backgroundColor = events[current_event].banner_colour;

    getById("d").style.backgroundColor = events[current_event].banner_colour;
    getById("h").style.backgroundColor = events[current_event].banner_colour;
    getById("m").style.backgroundColor = events[current_event].banner_colour;
    getById("s").style.backgroundColor = events[current_event].banner_colour;
}

function daysUntil(stats){
    var days = -1;

    date = new Date();
    var current_stats = [];
    current_stats.push(date.getDate());
    current_stats.push(date.getMonth() + 1);
    current_stats.push(date.getFullYear());

    while(current_stats[0] < stats[0] || current_stats[1] < stats[1] || current_stats[2] < stats[2]){
        days++;
        current_stats[0]++;

        if(current_stats[2] % 4 != 0){
            if(current_stats[0] > n_year[current_stats[1] - 1]){
                current_stats[1]++;
                current_stats[0] = 1;
            }
        }
        else{
            if(current_stats[0] > l_year[current_stats[1] - 1]){
                current_stats[1]++;
                current_stats[0] = 1;
            }
        }

        if(current_stats[1] > 12){
            current_stats[1] = 1;
            current_stats[2]++;
        }
    }

    return days;
}

function zFill(str, n){
    var out = "";

    for(var i = 0; i < n - str.length; i++){
        out += "0";
    }

    return out + str;
}

function getById(id){
    return document.getElementById(id);
}

function loadEvents(){
    var name_counter = 0;

    $.getJSON('events/event.json', function(json){
        while(typeof json["event" + name_counter] != "undefined"){
            var d = new Date();

            if(parseInt(d.getMonth() + 1) <= parseInt(json["event" + name_counter].event_month) && parseInt(d.getDate()) < parseInt(json["event" + name_counter].event_day)) {
                events.push(new Event());
                events[event_count].event_name = json["event" + name_counter].event_name;
                events[event_count].event_image = json["event" + name_counter].event_image;
                events[event_count].event_stats.push(parseInt(json["event" + name_counter].event_day));
                events[event_count].event_stats.push(parseInt(json["event" + name_counter].event_month));
                events[event_count].event_stats.push(parseInt(json["event" + name_counter].event_year));
                events[event_count].background_colour = json["event" + name_counter].background_colour;
                events[event_count].banner_colour = json["event" + name_counter].banner_colour;
                events[event_count].days = daysUntil(events[event_count].event_stats);

                if (event_count == 0) {
                    date = new Date();

                    getById("days").innerHTML = zFill(events[event_count].days + "", 5);
                    getById("hrs").innerHTML = zFill(23 - date.getHours() + "", 2);
                    getById("mins").innerHTML = zFill(59 - date.getMinutes() + "", 2);
                    getById("secs").innerHTML = zFill(59 - date.getSeconds() + "", 2);

                    loadColourScheme();
                }
                event_count++;
            }
            name_counter++;
        }
    });
}

function Event(){
    this.event_name;
    this.event_image;
    this.event_stats = [];
    this.background_colour;
    this.banner_colour;
    this.days;
}
