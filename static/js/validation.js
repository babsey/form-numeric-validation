/*!
 * Form numeric validation with bootstrap v0.1
 * https://github.com/babsey/form-numeric-validation
 *
 * Copyright 2015 Sebastian Spreizer
 * Released under the BSD 2-clause "Simplified" Licence
 */

function clear_field(field) {
    field.parents('.form-group').removeClass('has-error has-success has-feedback');
    field.parent().find(".error-text").remove();
    field.parent().find("span.glyphicon").remove();
}

function clear_form(form) {
    form.find(".alert").remove();
    form.find('.form-group').removeClass('has-error has-success has-feedback');
    form.find(".error-text").remove();
    form.find("span.glyphicon").remove();
}

function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

function numeric_validation(div, val) {
    var error_msg = [];
    if ( !(isNumber(val)) ) { error_msg.push('Enter a valid number value.'); }
    if ( (div.hasClass('nonzero')) && (parseFloat(val) == 0.0) ) { error_msg.push('Enter a valid nonzero value.'); }
    if ( (div.hasClass('positive')) && (parseFloat(val) < 0.0) ) { error_msg.push('Enter a valid positive value.'); }
    if ( (div.hasClass('negative')) && (parseFloat(val) > 0.0) ) { error_msg.push('Enter a valid negative value.'); }
    if (  div.hasClass('min') || div.hasClass('max') ) {
        var classes = div.attr("class").split(' ');
        if (classes.indexOf('max')) {
            var val_max = parseFloat(classes[classes.indexOf('max')+1]);
            if (parseFloat(val) > val_max) { error_msg.push('Enter a valid value that is smaller than ' + val_max +'.'); }
        }
        if (classes.indexOf('min')) {
            var val_min = parseFloat(classes[classes.indexOf('min')+1]);
            if (parseFloat(val) < val_min) { error_msg.push('Enter a valid value that is greater than ' + val_min +'.'); }
        }
    }
    return error_msg
}

function field_validation(field) {
    field.prop('disabled', true);
    clear_field(field);
    var val = field.val();
    var div = field.parents('.form-group');
    var error_msg = [];
    if ( val == '' && field.hasClass('required') ) {
        error_msg.push('This field is required.');
    } else if (val != '') {
        if (field.hasClass('number')) {
            if (field.hasClass('list')) {
                val_list = val.split(',');
                for (var i=0; i<val_list.length; i++) {
                    if (val_list[i] != '') {
                        error_msg.push(numeric_validation(field,val_list[i]));
                    }
                }
            } else {
                error_msg = numeric_validation(field, val);
            }
        }
    }
    if (error_msg.length == 0) {
        if (val || field.hasClass('required')) {
            div.addClass('has-success');
            $('<span aria-hidden="true" class="glyphicon glyphicon-ok form-control-feedback"></span>').insertAfter(field);
        }
    } else {
        div.addClass('has-error');
        $('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>').insertAfter(field);
        for (var i=0; i<error_msg.length;i++) {
            $('<span class="error-text help-block"><strong>'+error_msg[i]+'</strong></span>').insertAfter(field);
        }
    }
    div.addClass('has-feedback');
    field.prop('disabled', false);
    return (error_msg.length == 0)
}

function form_validation(form, clean_form_action, clean_field_action) {
    form.find('input').prop('disabled', true);
    clear_form(form)
    var error_fields = [];
    form.find('input:visible:not(.checkboxinput):not(.btn)').each(function () {
        if ($(this).val() || $(this).hasClass('required')) {
            if (field_validation($(this))) {
                clean_field_action
            } else {
                error_fields.push($(this));
            }
        }
    })
    if (error_fields.length == 0) {
        clean_form_action
    } else {
        form.prepend('<h4 class="alert alert-danger">Oh snap! You got an error!</h4>');
        error_fields[0].focus();
    }
    form.find('input').prop('disabled', false);
    return error_fields
}
