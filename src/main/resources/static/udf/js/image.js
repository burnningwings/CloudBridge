jQuery(function () {
    var $ = jQuery,
        csrfToken = $("meta[name='_csrf']").attr("content"),
        csrfHeader = $("meta[name='_csrf_header']").attr("content"),
        imageList = $('#images'),
        viewer;

    if (imageList.length > 0) {
        var deleteButton = $('<li role="button" class="viewer-delete" data-viewer-action="delete"></li>'),
            currentImage;

        viewer = new Viewer(imageList[0], {
            inline: true,
            toolbar: {
                zoomIn: 1,
                zoomOut: 1,
                oneToOne: 0,
                reset: 1,
                prev: 1,
                play: 0,
                next: 1,
                rotateLeft: 1,
                rotateRight: 1,
                flipHorizontal: 0,
                flipVertical: 0
            },
            ready: function () {
                var viewerToolbar = $('div.viewer-toolbar ul');
                deleteButton.appendTo(viewerToolbar);
            },
            viewed: function (event) {
                currentImage = $(event.detail.originalImage);
            }
        });

        function getDeleteURL(image) {
            var pathnameSeg = window.location.pathname.split('/'),
                imageNamePrefix = image.attr('id').split('.')[0];

            return '/' + pathnameSeg[1] + '/image/' +
                pathnameSeg[pathnameSeg.length - 1] + '/' +
                imageNamePrefix;
        }

        deleteButton.click(function () {
            var oldViewerLength = viewer.length;

            if (!currentImage) {
                return;
            }

            $.ajax({
                type: 'DELETE',
                async: true,
                url: getDeleteURL(currentImage),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader(csrfHeader, csrfToken);
                },
                success: function () {
                    currentImage.remove();
                    viewer.update();
                    currentImage = null;
                    showTransientDialog("删除图片成功");
                    // All images have been deleted.
                    if (oldViewerLength === 1) {
                        viewer.destroy();
                        var imageListParent = imageList.parent();
                        imageList.remove();
                        $('<p id="msg-no-images">暂无图片</p>').appendTo(imageListParent);
                    }
                },
                error: function (xhr) {
                    if (xhr.status == 403) {
                        showTransientDialog("您没有权限");
                    } else {
                        showTransientDialog("删除图片失败");
                    }
                }
            });
        });
    }
});
