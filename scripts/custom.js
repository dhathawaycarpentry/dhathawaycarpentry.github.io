$(function() {

  var contentContainer = $("#content-container");
  var photographs = null;
  var slideshowObj = null;

  contentContainer.fadeOut(1);
  $(".fade-in").fadeIn(1000);

  function getPageName() {
    var pageName = window.location.pathname;
    if (pageName.slice(-1) === "/") {
      pageName = pageName.substring(0, pageName.length - 1);
    }
    pageName = pageName.split("/").pop();

    if (pageName === "") pageName = "Home.html";
    return pageName;
  }

  function initKenBurns() {
    jQuery(function () {
      jQuery("#bannerscollection_zoominout_generous")
        .bannerscollection_zoominout({
          skin: "opportune",
          responsive: false,
          absUrl: "/css/",
          width: 900,
          height: 400,
          width100Proc: false,
          height100Proc: false,
          autoPlay: 8,
          enableTouchScreen: false,
          pauseOnMouseOver: false,
          horizontalPosition: "center",
          verticalPosition: "center",
          initialZoom: 1,
          finalZoom: 0.5,
          duration: 10,
          thumbsOnMarginTop: 0,
          thumbsWrapperMarginTop: -10,
          showPreviewThumbs: false,
          showCircleTimer: false,
          showNavArrows: false,
          showBottomNav: false,
          autoHideBottomNav: false,
          zoomEasing: "easeOutSine",
          callback: function(obj) {
            slideshowObj = obj;
          }
        });
    });
  }

  function populateGallery(photographs) {
    var galleryList = $(".bannerscollection_zoominout_list");
    if (!galleryList) return;
    galleryList.html("");
    var galleryTexts = $(".bannerscollection_zoominout_text_container");
    galleryTexts.html("");

    for (var i in photographs) {
      if (photographs.hasOwnProperty(i)) {
        var photo = photographs[i];

        var newHtml = "<li " +
          "data-initialzoom=\"" + photo.initialzoom + "\" " +
          "data-finalzoom=\"" + photo.finalzoom + "\" " +
          "data-horizontalposition=\"" + photo.horizontalposition + "\" " +
          "data-verticalposition=\"" + photo.verticalposition + "\" " +
          "data-bottom-thumb=\"/photos/thumbs/" + photo.filename + "\" " +
          "data-text-id=\"#photo_description_" + i.toString() + "\" " +
          "><img src=\"/photos/" + photo.filename + "\" " +
          "style=\"width: " + photo.width + "px; height: " + photo.height + "px;\" " +
          "alt=\"\" /></li>";

        galleryList.append(newHtml);

        newHtml = "<div " +
          "id=\"photo_description_" + i + "\" " +
          "class=\"bannerscollection_zoominout_texts\">" +
          "<div class=\"bannerscollection_zoominout_text_line textElement11_generous\"" +
          "data-initial-left=\"-50\"" +
          "data-initial-top=\"0\"" +
          "data-final-left=\"20\"" +
          "data-final-top=\"20\"" +
          "data-duration=\"0.5\"" +
          "data-fade-start=\"0\"" +
          "data-delay=\"0.23\">" +
          "<div class=\"phototitle\">" + photo.description + "</div></div>";

        galleryTexts.append(newHtml);
      }
    }
  }

  function loadGallery() {
    if (photographs == null || photographs.length === 0) {

      $.getJSON("/photos/__list.json",  function ( data) {
        if (data !== null) {
          photographs = data;
        }

        populateGallery(photographs);
        initKenBurns();
      });
    } else {
      populateGallery(photographs);
      initKenBurns(photographs);
    }
  }

  function initCarousel() {
    $('[data-ride = "carousel"]').each(function() {
      var $carousel = $(this);
      $carousel.carousel($carousel.data());
    });
  }

  function showTextValue(identifier, value) {
    var element = $(identifier);
    if (element != null) {
      element.html(value);
    }
  }

  function doPageAnimations() {
    showTextValue("#email-address", 'dhcarpentry@outlook.com');
    showTextValue("#telephone-number", "07748 151682");

    //$(".switch").addClass("on");
    var count = $(".switch").length;
    if (count > 0) {
      count = 2;
      $(".switch").each(function(i, e) {
        setTimeout(function() {
          $(e).addClass("on");
        }, count++ * 100);

      });
    }
  }

  function doPageFadeout(faded) {

    var count = $(".switch.on").length;

    if (count > 0) {
      count = 2;
      $(".switch.on").each(function(i, e) {
        setTimeout(function() {
          $(e).addClass("off");
        }, count++ * 100);
      });
      setTimeout(function() {
        contentContainer.fadeOut(500, function() { faded.resolve(); });
      }, count * 100 + 300);
    } else {
      contentContainer.fadeOut(500, function() { faded.resolve(); });
    }

    return;
  }

  function navigateToPage() {

    if (slideshowObj) {
      slideshowObj.abort = true;
      slideshowObj = null;
    }

    var pageName = getPageName();

    var faded = $.Deferred();
    var geted = $.Deferred();
    var fragment = null;

    doPageFadeout(faded);

    if (pageName.slice(-1) === "\\") {
      geted.resolve();
    } else {
      $.get("/" + pageName, function(response) {

        var markup = $("<div>" + response + "</div>");
        fragment = markup.find("#content-container").html();

        geted.resolve();
      });
    }

    $.when(faded, geted).done(function() {
      var container = contentContainer;

      if (fragment !== null) {
        container.html(fragment);
      }

      container.fadeIn(300, function() {
        doPageAnimations();
        initCarousel();
        loadGallery();
      });
    });
  }

  photographs = [];
  $("a[data-role = 'ajax']").click(function(e) {
    $(".navbar-nav").children().removeClass('active');
    $(this.parentElement).addClass('active');

    if (Modernizr.history) {
      e.preventDefault();
      var pageName = $(this).attr("href");
      window.history.pushState(null, "", pageName);
      navigateToPage();
    }
  });

  $(".navbar-brand").click(function(e) {
    $(".navbar-nav").children().removeClass("active");
    $($(".navbar-nav").children()[0]).addClass("active");

    if (Modernizr.history) {
      e.preventDefault();
      window.history.pushState(null, "", "/");
      navigateToPage();
    }
  });


  var firstTime = true;

  $(window).on("popstate", function(e) {

    if (firstTime) {
      firstTime = false;
      if ($.browser && $.browser.webkit) {
        return;
      }
    }

    navigateToPage();
  });

  navigateToPage();
});