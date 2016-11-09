function updateNotificationCount() {
    $.getJSON("/notifications", function(data) {
        console.log('notification count', data.length);
        $("#notification-count").text(data.length || '');
    });
}

function getNotifications() {
    $.getJSON("/notifications", function(data) {
        console.log('notification count', data.length);
        $("#notification-count").text(data.length || '');
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

$(document).ready(function(e) {
    getNotifications();

    // Set up WebSocket connection
    var HOST = location.origin.replace(/^http/, 'ws')
    var socket = new WebSocket(HOST);
    socket.onopen = function() {
        console.log('Socket open.');
    };
    socket.onmessage = function(message) {
        console.log('Socket server message', message);
        let data = JSON.parse(message.data);
        getNotifications();
        //$("#notification-new").addClass('glyphicon glyphicon-exclamation-sign');
    };
});
