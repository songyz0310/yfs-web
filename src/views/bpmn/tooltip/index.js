import {
  assign
} from 'min-dash';

import './tooltip.scss';

const html = '<div class="_tooltip"></div>';

const DEFAULT_OPTIONS = {
  offsetX: 0,
  offsetY: 0,
  selector: ".tooltip[title]"
};

export default function tooltip(options) {

  options = assign({}, DEFAULT_OPTIONS, options);

  setTimeout(() => {
    $(options.selector).off('mouseover mouseout').on('mouseover mouseout', function (event) {
      var ele = event.target;
      let $titleBox = $('._tooltip');
      if (event.originalEvent.type == 'mouseover') {
        if ($titleBox.length == 0)
          $titleBox = $(html).appendTo('body');

        let title = ele.title;
        $(this).data("title", title);
        ele.title = '';
        options.top = $(this).offset().top + $(this).height() + options.offsetY;
        options.left = $(this).offset().left + $(this).width() + options.offsetX;
        $titleBox.css(options).text(title || "").show();

      } else {
        ele.title = $(this).data("title");
        $titleBox.hide();
      }
    })
  }, 100);
}
