function Validator(formSelector) {
  var formElement = $(formSelector);
  var formRules = {};
  var validator = {
    required: function (value) {
      return value ? undefined : "この項目は必須です。";
    },
    email: function (value) {
      if (!value) return "この項目は必須です。";
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(value).toLowerCase())
        ? undefined
        : "無効な電子メール";
    },
    number: function (value) {
      if (!value) return "この項目は必須です。";
      var re = /^[0-9]+$/;
      return re.test(String(value))
        ? undefined
        : "このフィールドは数値でなければなりません";
    },
    max: function (max) {
      return function (value) {
        if (!value) return "この項目は必須です。";
        var stringNum = String(value).replaceAll(" ", "");
        return stringNum.length == max
          ? undefined
          : `電話番号は ${max} 桁である必要があります`;
      };
    },
  };

  // Validate when input and blur input element
  if (formElement) {
    var inputs = formElement.find("[name][rules]");
    inputs.each(function () {
      var rules = $(this).attr("rules").split("|");
      for (var rule of rules) {
        var isHasColon = rule.includes(":");
        var ruleInfo = [];
        if (isHasColon) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }
        var ruleFunc = validator[rule];

        if (isHasColon) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[this.name])) {
          formRules[this.name].push(ruleFunc);
        } else {
          formRules[this.name] = [ruleFunc];
        }
      }
      $(this).on("blur", function (e) {
        handleValidate.call(this, e);
      });
      $(this).on("input", function (e) {
        handleValidate.call(this, e);
      });
    });

    // Validate when submit
    $(formElement).on("submit", function (e) {
      e.preventDefault();
      var inputs = formElement.find("[name][rules]");
      var isValidResult = [];
      inputs.each(function () {
        isValidResult.push(handleValidate.call($(this), { target: this }));
      });

      let check = isValidResult.some((valid) => valid === false);

      if (!check) {
        this.reset();
        alert("すぐにご連絡いたします!");
      }
    });

    // Validate function and show error in UI
    function handleValidate(e) {
      var rules = formRules[e.target.name];
      var errorMess = "";
      for (var rule of rules) {
        errorMess = rule(e.target.value);
        if (errorMess) break;
      }
      if (errorMess) {
        $(this).next().text(errorMess);
      } else {
        $(this).next().text("");
      }
      return errorMess ? false : true;
    }
  }
}
$(function () {
  // Mainvisual
  $(".c-mainvisual__slider").slick({
    cssEase: "linear",
    autoplay: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
        },
      },
    ],
  });

  // Mainvisual news
  $(".c-mainvisual__news").slick({
    cssEase: "linear",
    autoplay: false,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    prevArrow: $(".c-news__button--prev"),
    nextArrow: $(".c-news__button--next"),
  });

  // Product slide
  function createSlide() {
    if ($(window).width() <= 1024) {
      $(".c-product__slide").not('.slick-initialized').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: `<button type='button' class='c-product__next slick-next'><img src='./assets/img/next-icon.png' alt="next icon"></button>`,
        prevArrow: `<button type='button' class='c-product__prev slick-prev'><img src='./assets/img/prev-icon.png' alt="next icon"></button>`,
        responsive: [
          {
            breakpoint: 577,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true
            }
          }
        ]
      });
    }
    else {
      $('.c-product__slide.slick-initialized').slick('unslick');
    }
  }

  $(window).resize(function () {
    createSlide();
  });
  $(window).on('load', function () {
    createSlide();
  });

  $(window).scroll(function (event) {
    var distanceFixedHeader = 150;
    if ($(this).scrollTop() >= distanceFixedHeader) {
      $(".c-header").addClass("is-scroll");
      $(".c-header__logoimg").attr("src", "./assets/img/fixed-logo.png");
      $("#scroll-top").addClass("is-show");
    } else {
      $(".c-header").removeClass("is-scroll");
      $(".c-header__logoimg").attr("src", "./assets/img/logo.png");
      $("#scroll-top").removeClass("is-show");
    }
  });

  $("#scroll-top").click(function () {
    $(window).scrollTop(0);
  });

  Validator("#contact__form");

  $(".contact__form--dropdown").on("change", function (e) {
    if (!e.target.value) {
      $(this).addClass("is-focus");
    } else {
      $(this).removeClass("is-focus");
    }
  });

  // Open close modal
  $(".c-header__toggle").click(function () {
    $(this).toggleClass("open");
    $(".c-gnavsp").toggleClass("open").scrollTop(0);
    $(".c-menusp__subnav").removeClass("active");
    $(".c-header__menusp").show();

    if ($(this).hasClass("open")) {
      $("body").css("overflow", "hidden");
    } else {
      $("body").css("overflow", "");
    }
  });

  $(".c-menusp__item:not(.c-menusp__item.c-menusp__sbnav)").click(function (e) {
    $(".c-header__toggle").trigger("click");
  });

  $(".c-menusp__sbnav").click(function () {
    var idSubNav = $(this).attr("data-subnav");
    $(`#subnav${idSubNav}`).addClass("active");
    $(".c-header__menusp").hide();
  });

  $(".c-menusp__back").click(function () {
    $(this).parent().removeClass("active");
    $(".c-header__menusp").show();
  });
});
