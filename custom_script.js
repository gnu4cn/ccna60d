var honkit_link = $('a[class=gitbook-link]');

var text = honkit_link.text();
honkit_link.parent().html(`<span style="align: center;">${text}</span>`);

