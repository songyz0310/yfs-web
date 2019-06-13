import './tooltip.scss';

const html = '<div class="_tooltip"></div>';

export default function tooltip(select) {

    setTimeout(() => {
        $(select).on('mouseover mouseout', function(event) {
            var ele = event.target;
            let title = ele.title;
            let $titleBox = $('._tooltip');
            if (event.originalEvent.type == 'mouseover') {
                if ($titleBox.length == 0)
                    $titleBox = $(html).appendTo('body');

                $(this).data("title", title);
                ele.title = '';

                $titleBox.css({
                    top: $(this).offset().top + $(this).height() / 2 - 15,
                    left: $(this).offset().left + $(this).width() + 15,
                }).text(title || "").show();

            } else {
                ele.title = $(this).data("title");
                $('._tooltip').hide();
            }

        })
    }, 100);
}