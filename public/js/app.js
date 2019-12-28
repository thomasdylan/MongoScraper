$.getJSON("/articles", (data) => {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<strong>" + data[i].title + "</strong>" + "<br />" + "<a href=" + data[i].link + " target= _blank>" + data[i].link + "</a>" + "<br />" + data[i].sum + "</p>");
    }
});

$(document).on("click", "p", function () {
    $("#notes").empty();
    $("#comments").empty();
    const thisId = $(this).attr("data-id");

    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data[0].title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' placeholder='Name'>");
            $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");
            $("#notes").append("<button data-id='" + data[0]._id + "' id='savenote'>Add Comment</button> <br /><br />");
            $("#notes").append("<p data-id='" + data[0].note._id + "'>" + "<strong>" + "Comments <hr />" + data[0].note.title + "</strong>" + "<br />" + data[0].note.body + "</p> <br />");
        });
});

$(document).on("click", "#savenote", function () {
    const thisId = $(this).attr("data-id");

    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});