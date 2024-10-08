<?php

class ewic_sc_widget extends WP_Widget
{

    // Create Widget
    public function __construct()
    {

        $widget_ops  = array( 'classname' => 'widget_ewic_sc_widget', 'description' => __( 'Use this widget to display your images slider.' ) );
        $control_ops = array( 'width' => 295 );

        parent::__construct( 'ewic-widget', __( 'Image Slider Widget' ), $widget_ops, $control_ops );

    }

    // Widget Content
    public function widget( $args, $instance )
    {

        extract( $args );

        if ( isset( $instance['ewic_shortcode'] ) && $instance['ewic_shortcode'] != 'select' ) {

            $ewic_shortcode = $instance['ewic_shortcode'];

            $ewic_do_widget = do_shortcode( '[espro-slider id="'.$ewic_shortcode.'" iswidget="widget"]' );

        } else {

            $ewic_do_widget = '<p>Please select slider first.</p>';

        }

        echo $before_widget;

        echo $ewic_do_widget;

        echo $after_widget;

    }

    // Update and save the widget
    public function update( $new_instance, $old_instance )
    {

        $instance = $old_instance;

        $instance['ewic_shortcode'] = $new_instance['ewic_shortcode'];

        return $new_instance;

    }

    // If widget content needs a form
    public function form( $instance )
    {

        echo '<p><label for="'.esc_attr( $this->get_field_id( 'ewic_shortcode' ) ).'">'.__( 'Select your Slider name and hit save button', 'image-slider-widget' ).'.<br /><select id="'.esc_attr( $this->get_field_id( 'ewic_shortcode' ) ).'" name="'.esc_attr( $this->get_field_name( 'ewic_shortcode' ) ).'" ><option value="select">- Select -</option>';

        global $post;
        $args = array(
            'post_type'      => 'easyimageslider',
            'order'          => 'ASC',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        );

        $iscurr = ( isset( $instance['ewic_shortcode'] ) ? $instance['ewic_shortcode'] : 'select' );

        $myposts = get_posts( $args );

        if ( ! empty( $myposts ) ) {

            foreach ( $myposts as $post ): setup_postdata( $post );
                echo '<option value='.esc_attr( $post->ID ).''.selected( $iscurr, $post->ID ).'>'.esc_html( esc_js( the_title( null, null, false ) ) ).'</option>';
            endforeach;
        }

        echo '</select></label></p>';

    }

}

function ewic_widget_init()
{

    register_widget( 'ewic_sc_widget' );

}

add_action( 'widgets_init', 'ewic_widget_init' );