$(document).ready(function () {
    actionsTableMenu();
    delEvent();
    popups();
    setDifferentColor();
    tabs('.tab');
    setScrollHeight();
    destroyScrollOnHover('.jspScrollable');
    strangeSelectActivation();
    addTags();
    removeTag();
    filterToggle();
    competitionItem();
    categoryTable();

    //для реинита кастомных чекбоксов - вставь вызов этой функции в аякс
    checkedInput();


    $('.scroll-pane').jScrollPane({
        autoReinitialise: true
    });

    $(window).resize(function () {
        setScrollHeight();
    });

    //popup switchers
    new DG.OnOffSwitch({
        el: '#details-is-active',
        width: 28,
        height: 17,
        trackBorderWidth: 0,
        trackColorOn: '#d2d9e1',
        trackColorOff: '#d2d9e1',
        listener: function (name, checked) {
            if (!checked) {
                $(this.el).prev().prev('.checkbox-status').addClass('active');
                $(this.el).next('.checkbox-status').removeClass('active');
            } else {
                $(this.el).prev().prev('.checkbox-status').removeClass('active');
                $(this.el).next('.checkbox-status').addClass('active');
            }
        }
    });

    new DG.OnOffSwitch({
        el: '#reprice-is-active',
        width: 28,
        height: 17,
        trackBorderWidth: 0,
        trackColorOn: '#d2d9e1',
        trackColorOff: '#d2d9e1',
        listener: function (name, checked) {
            if (!checked) {
                $(this.el).prev().prev('.checkbox-status').addClass('active');
                $(this.el).next('.checkbox-status').removeClass('active');
            } else {
                $(this.el).prev().prev('.checkbox-status').removeClass('active');
                $(this.el).next('.checkbox-status').addClass('active');
            }
        }
    });

    $('.js_custom-select').select2({
        width: "100%",
        theme: 'classic',
        minimumResultsForSearch: Infinity
    });

    switchButtonInit();
});

function actionsTableMenu() {
    $(document).on('click', '.actions-table td:last-of-type', function (e) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.actions-table td:last-of-type').removeClass('active');
            $(this).addClass('active');
        }
    })
}

function delEvent() {
    $(document).on('click', '.js_del-event', function () {
        $(this).closest('tr').remove();
    })
}

function popups() {
    //popup btn
    $('.js_popup-btn').on('click', function () {
        var id = $(this).data('popup');

        //scroll to popup top
        $('body, html').animate({scrollTop: 51}, 500);

        $('.popup-side-wrap').addClass('active');
        $('.popup').not('#' + id).removeClass('active');

        $('#' + id).addClass('active');
    });

    //popup close
    $('.popup-close').on('click', function () {
        if ($(this).hasClass('js_confirmation')) {
            $('.popup-confirmation-overlay').addClass('active');
            return;
        }

        $(this).closest('.popup').removeClass('active');
        $('.popup-side-wrap').removeClass('active');
    });

    $('.js_confirmation-cancel').on('click', function () {
        $('.popup-confirmation-overlay').removeClass('active');
    });

    $('.js_confirmation-confirm').on('click', function () {
        $('.popup-confirmation-overlay').removeClass('active');
        $('.popup-side-wrap').removeClass('active');
        $('.popup').removeClass('active');
    });

    //popup shift
    $('.popup-side').each(function () {
        $(this).css({'right': -parseInt($(this).outerWidth()) - 20 + 'px'});
    });
}

function setDifferentColor() {
    var $els = $('.table-change-price__difference');

    if ($els) {
        $els.each(function () {
            var $price = $(this).closest('td').find('.table-change-price__not-my-price');
            if (parseFloat($(this).html()) > 0) {
                $price.css({"color": "#21c362"});
            } else if (parseFloat($(this).html()) < 0) {
                $price.css({"color": "#eb1053"});
            } else {
                $price.css({"color": "inherit"});
            }
        });
    }
}

function tabs(element) {
    $(element).on('click', function () {
        $(this).closest('.tabs-wrap').find('.tab, .panel').removeClass('active');
        $(this).addClass('active').closest('.tabs-wrap')
            .find('div[data-id="' + $(this).attr('data-id') + '"]').addClass('active');
    });
}

function setScrollHeight() {
    var popupHeaderHeight = 0 || $('.popup-details-header').outerHeight(true),
        titleHeight = 0 || $('.popup-side__title').outerHeight(true);

    $('.popup-side .panels').outerHeight($('.content').outerHeight() - titleHeight - popupHeaderHeight - $('.tabs').outerHeight(true) - 60);
}

function destroyScrollOnHover(element) {
    $(window).mouseover(function (e) {

        if ($(e.target).closest('.jspScrollable').length) {
            $(element).bind('mousewheel DOMMouseScroll', function (e) {
                var e0 = e.originalEvent,
                    delta = e0.wheelDelta || -e0.detail;

                this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                e.preventDefault();
            });
        }
    })
}

function switchButtonInit() {
    $('.switch-button').each(function () {
        if (!$(this).prop('checked')) {
            $(this).prev('.checkbox-status').addClass('active');
            $(this).next().next('.checkbox-status').removeClass('active');
        } else {
            $(this).prev('.checkbox-status').removeClass('active');
            $(this).next().next('.checkbox-status').addClass('active');
        }
    })
}

function strangeSelectActivation() {
    var strSelectBrand = 'Выбрать бренд',
        strAddBrand = 'Добавить новый бренд';


    $(document).on('click', '.js_strange-select-select-brand', function () {
        $(this).text(strAddBrand)
            .prev().text(strSelectBrand)
            .closest('.form-field')
            .find('.js_custom-select').removeAttr('disabled');
    });
}

function addTags() {
    $('.js_add-tag').on('keypress', function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            var value = $(this).val().trim(),
                $div, $input;

            if (!isTagMatces($(this), value)) {
                $div = $("<div/>", {
                    "class": "tags-field__item",
                    text: value
                });

                $input = $("<input>", {
                    "class": "tags-field__item",
                    "type": "hidden",
                    "name": value,
                    "value": value
                });

                $close = $("<div/>", {
                    "class": "tags-field__item-close"
                });

                $(this).val('').closest('.form-field').find('.tags-field').append($div.append($input, $close));
            }
        }
    });
}

function removeTag() {
    $(document).on('click', '.tags-field__item-close', function () {
        $(this).parent().remove();
    });
}

function isTagMatces($el, value) {
    var arr = $el.closest('.form-field').find('.tags-field input[type="hidden"]'),
        i;

    for (i = 0; i < arr.length; i++) {
        if (arr[i].name === value) {
            $el.val('');
            return true;
        }
    }

    return false;
}

//custom checkboxes
function checkedInput() {
    var reset = document.querySelectorAll('input[type="reset"]');

    inspectionInputs(document.querySelectorAll('input[type="checkbox"], input[type="radio"]'));

    document.addEventListener('change', function (e) {
        if (e.target.closest('.checkbox') && !e.target.hasAttribute('disabled')) {
            e.target.closest('.checkbox').classList.toggle('active');
        }

        if (e.target.closest('.radio')) {
            inspectionInputs(document.querySelectorAll('input[type="radio"]'));
        }
    });

    document.addEventListener('click', function (e) {
        for (var i = 0; i < reset.length; i++) {
            if (e.target === reset[i]) {
                setTimeout(function () {
                    inspectionInputs(document.querySelectorAll('input[type="checkbox"], input[type="radio"]'));
                }, 0);
            }
        }
    })
}

function inspectionInputs(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
            arr[i].parentElement.classList.add('active');
        } else {
            arr[i].parentElement.classList.remove('active');
        }

        if (arr[i].hasAttribute('disabled')) {
            arr[i].parentElement.classList.add('disabled');
        }
    }
}

//filter
function filterToggle() {
    var text = 'Выбрать',
        textActive = 'Свернуть';

    $(document).on('click', '.filter-field__btn', function () {
        $(this).toggleClass('active').closest('.filter-field').find('.filter-checkbox-wrap').stop().slideToggle(100);

        if ($(this).hasClass('active')) {
            $(this).text(textActive);
        } else {
            $(this).text(text);
        }
    })
}

function competitionItem() {
    $(document).on('click', '.competitor-details__remove', function () {
        $(this).closest('.competitor-details-added-item').remove();
    });

    $(document).on('click', '.competitor-details__edit', function () {
        $(this).closest('.competitor-details-added-item').find('.competitor-details-added-form').slideDown(100);
    });

    $(document).on('click', '.js_added-form-cancel', function () {
        $(this).closest('.competitor-details-added-item').find('.competitor-details-added-form').slideUp(100);
    });

    $(document).on('click', '.js_add-form-cancel', function () {
        $(this).closest('.competitor-details-add-content').slideUp(100);
    });

    $(document).on('click', '.js_competitor-details__add', function () {
        $(this).closest('.competitor-details-add').find('.competitor-details-add-content').slideDown(100);
    });
}

function categoryTable() {
    $('.table-category-main table').closest('tr').addClass('table-subcategory').prev('tr').addClass('table-category-parent');

    $('.table-category-parent').each(function () {
        $btn = $("<div/>", {
            "class": "table-subcategory__btn",
            click: function () {
                $(this).closest('.table-category-parent').toggleClass('active').next('.table-subcategory').toggleClass('open');
            }
        });

        $(this).find('td:first-of-type').prepend($btn);
    });
}
