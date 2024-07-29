// Un-active everything when you click it
Array.prototype.forEach.call(document.getElementsByClassName("pagetoc")[0].children, function(el) {
    el.addEventHandler("click", function() {
        Array.prototype.forEach.call(document.getElementsByClassName("pagetoc")[0].children, function(el) {
            el.classList.remove("active");
        });
        el.classList.add("active");
    });
});

var updateFunction = function() {

    var id;
    var elements = document.getElementsByClassName("header");
    Array.prototype.forEach.call(elements, function(el) {
        if (window.pageYOffset >= el.offsetTop) {
            id = el;
        }
    });

    Array.prototype.forEach.call(document.getElementsByClassName("pagetoc")[0].children, function(el) {
        el.classList.remove("active");
    });
    if (!id) return;
    Array.prototype.forEach.call(document.getElementsByClassName("pagetoc")[0].children, function(el) {
        if (id.href.localeCompare(el.href) == 0) {
            el.classList.add("active");
        }
    });
};

// Populate sidebar on load
window.addEventListener('load', function() {
    var pagetoc = document.getElementsByClassName("pagetoc")[0];
    var elements = document.getElementsByClassName("header");
    Array.prototype.forEach.call(elements, function (el) {
        var link = document.createElement("a");
        link.appendChild(document.createTextNode(el.text));
        link.href = el.href;
        link.classList.add("pagetoc-" + el.parentElement.tagName);
        pagetoc.appendChild(link);
      });
    updateFunction.call();
});



// Handle active elements on scroll
window.addEventListener("scroll", updateFunction);

if(document.querySelector("#document-not-found404")) {
  let timeLeft = 10;

  var timerId = setInterval(() => {
    if(timeLeft == -1) {
      clearTimeout(timerId);
      let siteRoot = window.location.origin;
      window.location.replace(siteRoot);
    } else {
      let secCounts = document.querySelectorAll(".sec-count")
      secCounts.forEach(count => {
        count.innerHTML = timeLeft;
      });
      timeLeft--;
    }
  }, 1000);
}

var f = document.getElementById("last-change");
if (f) {
  var text = f.innerHTML;
  text = text.replace("Last change", "知识共享许可协议，CC - 最后修改")
  text = text.replace("commit", "于提交")

  f.innerHTML = text
}
