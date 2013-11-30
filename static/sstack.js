$(document).ready(function() {
    document.getElementById('form_name').onsubmit = add_user;
    window.setInterval(update, 2000);
    update();
});

$(document).keypress(function(eve) {
	var keycode = (eve.keyCode ? eve.keyCode : eve.which);
	if (keycode == '13') add_user();
});

function update() {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if ( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) {
            $("#sstack").empty();

            var info = eval("(" + xmlHttp.responseText + ")");
            for (var i = 0; i < info.stack.length; i++) {
                add_item(info.stack[i], false);
            }
        }
    }

    xmlHttp.open("GET", 'stack', true);
    xmlHttp.send(null);
}

function add_item(name, fade) {
    var row = document.createElement("li");
    row.className = "list-group-item";

    var text = document.createElement('span');
    text.appendChild(document.createTextNode(name));
    row.appendChild(text);

    var button = document.createElement("button");
    button.onclick = del_user(row, name);
    button.className = 'btn btn-danger badge';
    button.appendChild(document.createTextNode("Löschen"));
    row.appendChild(button);

    if (fade) $(row).hide();
    $(row).appendTo("#sstack");
    if (fade) $(row).fadeIn();
}

function add_user(eve) {
    var form = document.getElementById("form_div");
    var name = document.getElementById("name");
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            form.className = 'form-group';
            if (xmlHttp.status == 400) {
                form.className += ' has-error';
            } else if (xmlHttp.status == 405) {
                form.className += ' has-warning';
            } else if (xmlHttp.status == 201) {
                form.className += ' has-success';
                add_item(name.value, true);
            }
        }
    }
    xmlHttp.open("POST", 'stack/' + name.value, false);
    xmlHttp.send(null);
    return false;
}

function del_user(row, name) {
    function del() {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 204) {
                $(row).fadeOut();
            }
        }
        xmlHttp.open("DELETE", 'stack/' + name, false);
        xmlHttp.send(null);
    }
    return del;
}
