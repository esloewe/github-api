//HANDLEBARS

Handlebars.templates = Handlebars.templates || {};
var templates = document.querySelectorAll(
    'script[type="text/x-handlebars-template"]'
);
Array.prototype.slice.call(templates).forEach(function(script) {
    Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
});

//SCRIPT

var submitButton = $("#submit-button");
var resultsContainer = $("#results-container");

submitButton.on("click", function() {
    var username = $("input[name='username']").val(); // my username
    var password = $("input[name='password']").val(); // my pass
    var usernameToSearch = $("input[name='usernameToSearch']").val(); // the user i want to get
    var baseURL = "https://api.github.com";
    var endPoint = "/users/" + usernameToSearch + "/repos";

    $.ajax({
        url: baseURL + endPoint,
        headers: {
            Authorization: "Basic " + btoa(username + ":" + password)
        },
        success: function(payload) {


            var myTemplate = Handlebars.templates.github({
                repos: payload
            });

            resultsContainer.html(myTemplate);
            var insideRepos = $(".inside-repos");

            insideRepos.on("click", function(e) {

                var index = $(e.currentTarget).index();
                var fullname = payload[index].full_name;

                var newEndPoint = "/repos/" + fullname + "/commits";

                $.ajax({
                    url: baseURL + newEndPoint,
                    headers: {
                        Authorization:
                            "Basic " + btoa(username + ":" + password)
                    },
                    success: function(newPayload) {
                        var latest = newPayload.slice(0, 10);

                        var insideMyTemplate = Handlebars.templates.github2({
                            commits: latest
                        });

                        e.currentTarget.next().append(insideMyTemplate);
                    }
                });
            });
        }
    });
});
