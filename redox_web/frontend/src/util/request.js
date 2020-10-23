function createQueryStringFrom(params) {
    let components = [];
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            let value = params[key];
            components.push(
                encodeURIComponent(key) + "="
                + encodeURIComponent(value)
            );
        }
    }
    let joinedParams = components.join('&');
    return (components.length > 0) ? '?' + joinedParams : '';
}

export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function performGet(url, params = {}) {
    let queryString = createQueryStringFrom(params);
    return fetch(url + queryString, {
        headers: {"X-Requested-With": "XMLHttpRequest"},
    })
        .then(function(response) {
            if (response.redirected) {
                window.location.href = response.url;
            }
            return response.json();
        });
}

export function performPost(url, body) {
    let csrftoken = getCookie('csrftoken');

    return fetch(url, {
        method: "POST",
        redirect: 'follow',
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(body)}
    ).then(function(response) {
        if (response.redirected) {
            window.location.href = response.url;
        }
        return response;
    });
}

export function performDelete(url) {
    let csrftoken = getCookie('csrftoken');

    return fetch(url, {
        method: "DELETE",
        redirect: 'follow',
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
        }}
    ).then(function(response) {
        if (response.redirected) {
            window.location.href = response.url;
        }
        return response;
    });
}

export function performJsonPost(url, body) {
    let csrftoken = getCookie('csrftoken');

    return fetch(url, {
        method: "POST",
        redirect: 'follow',
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(body)})
        .then(function(response) {
            if (response.redirected) {
                window.location.href = response.url;
            }
            return response.json();
        });
}
