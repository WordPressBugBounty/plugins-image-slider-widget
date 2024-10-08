jQuery(document).ready(function($) {

    var images_frame,
		$images_ids = $('#image_list_id'),
		$all_images = $('#ewic_images_container ul.images_list'),
		$isstyle = 'style="display:block;width:100%"';

    jQuery('.ewic_add_images').on('click', function(event) {

        var $el = $(this),
            attachment_ids = $images_ids.val(),
            attachment_img;

        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (images_frame) {
            images_frame.open();
            return;
        }

        // Create the media frame.
        images_frame = wp.media.frames.downloadable_file = wp.media({
            // Set the title of the modal.
            title: 'Select Images',
            button: {
                text: 'Insert Images',
            },
            multiple: 'add'
        });


        // When an image is selected, run a callback.
        images_frame.on('select', function() {

            var selection = images_frame.state().get('selection');

            selection.map(function(attachment) {

                attachment = attachment.toJSON();

                if (attachment.id) {

                    $('.noimgs').remove();

                    attachment_ids = attachment_ids ? attachment_ids + "," + attachment.id : attachment.id;

                    if (typeof attachment.sizes.thumbnail == "undefined") {
                        if (typeof attachment.sizes.medium == "undefined") {
                            attachment_img = attachment.sizes.full.url;
                        } else {
                            attachment_img = attachment.sizes.medium.url;
                        }
                    } else {
                        attachment_img = attachment.sizes.thumbnail.url;
                    }

                    $all_images.append('\
                                <li ' + $isstyle + ' class="ewicthumbhandler" data-attachment_id="' + attachment.id + '">\
								<input type="hidden" name="ewic_meta[ewic_meta_select_images][' + attachment.id + '][images]" value="' + attachment.id + '" />\
								<div class="ewic-shorters">\
                                <img src="' + attachment_img + '" />\
								<span class="ewic-del-images"></span>\
								<label for="title-for-' + attachment.id + '">Title </label>\
								<input class="images-title" type="text" name="ewic_meta[ewic_meta_select_images][' + attachment.id + '][ttl]" value="' + attachment.title + '"/></div>\
                                </li>').hide().fadeIn(300);

                }

            });

            //$images_ids.val( attachment_ids );
        });

        // Finally, open the modal.
        images_frame.open();
    });

    // Remove images
    $('#ewic_images_container').on('click', '.ewic-del-images', function() {

        jQuery(this).parent().fadeOut(500, function() {

            $(this).closest('li.ewicthumbhandler').remove();

            ewic_is_img_exist(jQuery('.ewic-del-images'));

        });

        return false;

    });


    function ewic_is_img_exist(sel) {

        if (!$(sel).length) {

            dat = {};
            dat['action'] = 'ewic_img_remove';
            dat['pstid'] = $all_images.data('postid');
            dat['security'] = $all_images.data('nonce');

            jQuery.ajax({
                url: ajaxurl,
                type: 'POST',
                dataType: 'json',
                data: dat,

                success: function(response) {

                    if (response) {

                        $('.images_list').html('<div class="noimgs ewic_noimgs"><span>No images...</span></div>');

                    } else {

                        alert('Ajax Failed, please try again.');

                    }

                    // end success-		
                }

                // end ajax
            });

        }

    }

    // Upgrade Popup
    /* $('#ewicprcngtableclr').on('click', function() {

        $("#myModalupgrade").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return false;

    }); */

    $(document).modalWindow({

        // default CSS selectors
        "openTrigger": ".ewicprcngtableclr",
        "closeTrigger": ".closeTrigger",
        "modalContent": ".modalContent",
        "overLay" : "overLay",
      
        // width/height of the modal window
        "width" : 800,
/*         "height": 500, */
      
        // animation speed in milliseconds
        "feadSpeed" : 500
        
      });

    // Tumbnails View @since 1.1.23
    $('#ewic-thumb-view a').bind('click', function(event) {

        event.preventDefault();

        jQuery('#ewic-thumb-view a').removeClass('current');
        jQuery(this).addClass('current');

        if (jQuery('ul.images_list li').length) {

            switch (jQuery(this).attr('id')) {

                case 'ewiclist':

                    jQuery('#image_list_mode').val('ewiclist');
                    $isstyle = 'style="display:block;width:100%"';
                    jQuery('.ewicthumbhandler').fadeOut(500, function() {

                        jQuery(this).css({
                            'display': 'block',
                            'width': '100%'
                        }).effect("highlight", {
                            color: "#FFFADD"
                        }, 1000);

                    });

                    break;

                case 'ewicgrid':

                    jQuery('#image_list_mode').val('ewicgrid');
                    $isstyle = 'style="display:inline-block;width:49.7%"';
                    jQuery('.ewicthumbhandler').fadeOut(500, function() {

                        jQuery(this).css({
                            'display': 'inline-block',
                            'width': '49.7%'
                        }).effect("highlight", {
                            color: "#FFFADD"
                        }, 1000);

                    });

                    break;

                default:

            }

        }

    });

});

/* IntroJS */
function startIntro() {

    var intro = introJs();
    intro.setOptions({
        steps: [{
                element: '#title',
                intro: "First, enter your Slider title here."
            },
            {
                element: '#intro1',
                intro: "Click this button, after that select an images that you choose. You can use <b>Ctrl + Click</b> on images to select multiple images at once."
            },
            {
                element: '#ewic_images_container',
                intro: "All selected images will listed here.",
                position: 'right'
            },
            {
                element: '#ewic_meta_settings',
                intro: 'Finally, you can adjust the options below to fit your needs.',
                position: 'left'
            },
            {
                element: '#publish',
                intro: "When you are done, you can save the slider and put the slider into your post/page using Shortcode Manager or in widget area by dragging the widget named <b>Easy Slider Widget</b> from Appearance > Widget.",
                position: 'bottom'
            },
            {
                element: '#ewicbuydiv',
                intro: "Upgrade to <b>Pro Version</b> which gives you a tons of awesome features!",
                position: 'left'
            },
            {
                element: '#ewicdemodiv',
                intro: "Or you can see the <b>DEMO</b> first before you buy.",
                position: 'left'
            },
        ]
    });

    intro.setOption('tooltipPosition', 'auto');
    intro.setOption('positionPrecedence', ['left', 'right', 'bottom', 'top'])
    intro.start();

    intro.oncomplete(function() {
        jQuery('#side-sortables').css({
            position: 'fixed'
        });
    });

    intro.onchange(function() {
        jQuery('#side-sortables').css({
            position: 'relative'
        });
    });

}