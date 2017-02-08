function getNotifications() {
    $.getJSON("/notifications", function(data) {
        console.log('notification count', data.length);
        $("#notification-count").text(data.length || '').focus().blur(); // Bug in Safari: http://stackoverflow.com/questions/29969276/bootstrap-badge-dont-always-appear-in-safari
        $(".notifications-wrapper").empty();
        for(i in data) {
            n=data[i];
            $(".notifications-wrapper").append(
                `<div class="notification-item">
                    <h4 class="item-title">${n.title} <small class="pull-right">${n.date}</small></h4>
                    <p class="item-info">${n.body}</p>
                </div>`
                );
        }
    });
}

function clearNotifications() {
    $.get("/notifications/clear", function(data) {
        getNotifications();
    });
}

function showNotification(msg) {
    var html = $(`<div class="alert alert-info alert-dismissable page-alert">   
        <button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
        ${msg}
        </div>`);
    $('nav.navbar').before(html).slideDown();
    html.fadeTo(2000, 500).slideUp(500, function(){
        $(".alert-dismissable").alert('close');
    });
}

$(document).ready(function(e) {
    getNotifications();

    // Set up WebSocket connection
    var HOST = location.origin.replace(/^http/, 'ws')
    var socket = new WebSocket(HOST);
    socket.onopen = function() {
        console.log('Socket open.');
        var id = setInterval(function() {
            socket.send(JSON.stringify(new Date()), function() {  });
            console.log('Pinging server to keep alive');
        }, 30000);
    };
    socket.onmessage = function(message) {
        console.log('Socket server message', message);
        let data = JSON.parse(message.data);
        showNotification(`${data.notification.title} - ${data.notification.body}`);        
        getNotifications();
    };
});
