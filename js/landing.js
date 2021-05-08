// ---------------------------------------------
// Do activities after loading document

document.addEventListener("DOMContentLoaded", () => {
  // Animate numbers first
  animateNumbers();
  // Load wordpress posts
  loadWordpressPosts();
  // Add hambug functionality
  activateHambugs(); // Include navbar.js first!
});

//Load data from the JSON and render exco cards
window.onload = async function () {
  //clear any previously rendered cards
  document.getElementById("exco-cards-holder").innerHTML = "";
  try {
    const response = await fetch("./data/exco.json", {
      method: "GET",
    });

    let dataJson = JSON.parse(await response.text());

    if (dataJson !== null) {
      dataJson.forEach((person) => {
        document.getElementById("exco-cards-holder").innerHTML =
          document.getElementById("exco-cards-holder").innerHTML +
          `
      <div class="card mt-1 mb-1 blue-gradient" data-aos="fade-right">
          <div class="columns pt-1 pb-1 pl-2 pr-2">
              <div class="column is-4 mt-0 has-text-centered ">
                  <img src="` +
          person.image +
          `" class="eb-img" alt="Exco image">
              </div>
              <div class="column is-8 mt-1 has-text-left eb-title-container">
                  <p class="title is-4">` +
          person.name +
          `</p>
                  <p class="subtitle is-6 mb-1">` +
          person.position +
          `</p>                              
                  <div class="iconset">
                      <a href="` +
          person.twitter +
          `" target="_blank">
                          <span class="icon is-small mr-1 social"><i class="fab fa-twitter"></i></span>
                      </a>
                      <a href="` +
          person.facebook +
          `" target="_blank">
                          <span class="icon is-small mr-1 social"><i class="fab fa-facebook"></i></span>
                      </a>
                      <a href="` +
          person.instagram +
          `" target="_blank">
                          <span class="icon is-small mr-1 social"><i class="fab fa-instagram"></i></span>
                      </a>
                      <a href="mailto:` +
          person.email +
          `" target="_blank">
                          <span class="icon is-small mr-1 social"> <i class="fas solid alt fa-envelope"></i></span>
                      </a>
                      <a href="` +
          person.linkedin +
          `" target="_blank">
                          <span class="icon is-small mr-1 social"><i class="fab fa-linkedin"></i> </span>
                      </a>
                  </div>
              </div>
          </div>
      </div>
      `;
      });
    }
    // console.log(dataJson);
  } catch (e) {
    console.error(e);
  }
};

// ---------------------------------------------
// AJAX requests to Wordpress API

// https://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
function loadWordpressPosts() {
  // Designed from a 1366x768 resolution device (reference point).
  var titleCutOff = 45; // Number of max characters to include in post title displayed
  var contentCutOff = 150; // Number of max characters to include in post content displayed
  var titleContentRatio = 2.1; // Rough ratio of the font sizes title:content
  var screenRatio = screen.width / 1366; // Handle scaling with different screen sizes

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      // XMLHttpRequest.DONE == 4
      if (xmlhttp.status == 200) {
        var resp = xmlhttp.responseText;
        resp = JSON.parse(resp);
        test = resp;

        // Reset HTML content
        document.getElementById("news-carousel").innerHTML = " ";

        for (var i = 0; i < resp.length; i++) {
          var post_image =
            resp[i]._embedded["wp:featuredmedia"]["0"].source_url;

          var post_title = resp[i].title.rendered.slice(0, titleCutOff);
          if (resp[i].title.rendered.length > titleCutOff) post_title += "...";

          var p_contentCutOff = // Calculate cut off for the post
            contentCutOff -
            Math.ceil(
              (Math.min(resp[i].title.rendered.length, titleCutOff) *
                titleContentRatio) /
                screenRatio
            );

          var post_content =
            resp[i].content.rendered.slice(0, p_contentCutOff) + "...";
          // Make empty in mobile
          if (screen.width < 768) post_content = "";

          var post_link = resp[i].link;

          var card_html = `
                <div class="column item-${i + 1}">
                <div
                    class="card news-card blue-gradient hvr-icon-wobble-horizontal"
                >
                    <div class="news-card-content content">
                        <div class="columns">
                        <div class="column news-card-text">
                            <h1 class="title is-5 mb-1">${post_title}</h1>
                            <p class="is-hidden-mobile">${post_content}</p>
                            <a class="news-card-see-more" href="${post_link}">
                                <p>
                                See More
                                <span class="icon is-small">
                                    <i class="fa fa-arrow-right hvr-icon"></i>
                                </span>
                                </p>
                            </a>
                        </div>
                        <div class="column">
                            <img
                            class="news-card-image"
                            src="${post_image}"
                            alt=""
                            />
                        </div>
                        </div>
                    </div>
                </div>
                </div>
                `;
          document.getElementById("news-carousel").innerHTML += card_html;
        }
        // Initiate Bulma carousel
        bulmaCarousel.attach("#news-carousel", {
          slidesToScroll: 1,
          slidesToShow: 3,
          loop: true,
          autoplay: true,
          navigationKeys: false,
        });
      } else if (xmlhttp.status == 400) {
        console.log("Astro-Nut says error 400 in retrieving blog posts.");
      } else {
        console.log("Astro-Nut says error in retrieving blog posts.");
      }
    }
  };

  xmlhttp.open(
    "GET",
    "https://blog.sedsuoc.lk/wp-json/wp/v2/posts?per_page=9&_embed",
    true
  );
  xmlhttp.send();
}

// ---------------------------------------------
// Counting animation
function animateValue(id, start, end, duration, nextFunction = null) {
  if (start === end) return;
  var range = end - start;
  var current = start;
  var increment = end > start ? 1 : +1;
  var stepTime = Math.abs(Math.floor(duration / range));
  var obj = document.getElementById(id);
  document.getElementById(id + "-div").style.animation =
    "stat-fadeIn linear 1s";
  document.getElementById(id + "-div").style.visibility = "visible";
  var timer = setInterval(function () {
    current += increment;
    obj.innerHTML = current;
    // Call the next function half-way, then it looks better
    if (current == end - end / 4) {
      if (nextFunction != null) {
        nextFunction();
      }
    }
    if (current == end) {
      clearInterval(timer);
      obj.innerHTML += "+";
    }
  }, stepTime);
}

// https://stackoverflow.com/questions/16748813/mydiv-style-display-returns-blank-when-set-in-master-stylesheet
function getStyle(id, name) {
  var element = document.getElementById(id);
  return element.currentStyle
    ? element.currentStyle[name]
    : window.getComputedStyle
    ? window.getComputedStyle(element, null).getPropertyValue(name)
    : null;
}

function animateNumbers() {
  if (getStyle("sidecontainer", "display") != "none") {
    animateValue("cunties", 1, 20, 1000, function () {
      return animateValue("chappies", 1, 100, 1000, function () {
        return animateValue("memebers", 600, 999, 1000);
      });
    });
  }
}

// ---------------------------------------------
// Sending a message
var sentOnce = false;
function sendMessage() {
  if (sentOnce) {
    // Show you have sent already!
    document.getElementById("modal-title").innerHTML = "Wanna tell us more?";
    document.getElementById("modal-description").innerHTML =
      "We love lengthy conversations, <br> please drop us an email at <a href='mailto:info@sedsuoc.lk'>info@sedsuoc.lk</a>";
    document.getElementById("modal-button").innerHTML = "I'm excited!";
    document.getElementById("contact-modal").classList.add("is-active");
    return false;
  }
  msgData = {
    Name: document.getElementById("contact-name").value,
    Email: document.getElementById("contact-email").value,
    Message: document.getElementById("contact-message").value,
  };
  postData("https://formspree.io/f/mayaqkyj", msgData).then((data) => {
    if (data.ok == true) {
      sentOnce = true;
      // Show okay message!
      document.getElementById("modal-title").innerHTML = "Message Sent!";
      document.getElementById("modal-description").innerHTML =
        "Your message was successfully delivered. <br> Thank you for sharing your thoughts with SEDS UOC!";
      document.getElementById("modal-button").innerHTML = "Great!";
      document.getElementById("contact-modal").classList.add("is-active");
    } else {
      // Show oops!
      document.getElementById("modal-title").innerHTML = "Oops!";
      document.getElementById("modal-description").innerHTML =
        "We couldn't deliver your message. <br> Could you please try again later?";
      document.getElementById("contact-modal").classList.add("is-active");
    }
  });

  return false;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}
