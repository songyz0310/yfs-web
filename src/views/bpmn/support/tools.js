import download from 'downloadjs';

export function readFile(file) {

    console.info(typeof file)

    return new Promise(function(resolve, reject) {

        if (file instanceof File) {

            // check file api availability
            if (!window.FileReader) {
                reject('Looks like you use an older browser that does not support drag and drop. ' +
                    'Try using a modern browser such as Chrome, Firefox or Internet Explorer > 10.');
            }

            // no file chosen
            if (!file) {
                reject("no file chosen");
            }

            var reader = new FileReader();

            reader.onload = function(e) {
                resolve(e.target.result)
            };

            reader.readAsText(file);
        } else {
            reject("The argument is not a File type")
        }
    });

}



export function fileDownload(content, fileName, mimeType) {
    return download(
        'data:' + mimeType + ';charset=UTF-8,' + encodeURIComponent(content),
        fileName,
        mimeType
    );
}