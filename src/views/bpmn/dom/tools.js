//切换浏览器全屏方法
export function toggleFullScreen() {
    let fullScreenFlag;
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
    ) {
        var html = document.querySelector("html");
        if (html.requestFullscreen) {
            html.requestFullscreen();
        } else if (html.msRequestFullscreen) {
            html.msRequestFullscreen();
        } else if (html.mozRequestFullScreen) {
            html.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            html.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        fullScreenFlag = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        fullScreenFlag = false;
    }
    return fullScreenFlag;
}