// divide rows of main configuration table into separate divs based on instance, section and subsection
// processes each row of table and moves row from main table into appropriate section
function segregateRows(instance, sectionId, subSectionId, inputType, thisRow) {

  if ($('#' + instance + '_sectionInputRows_' + subSectionId +  '> thead').length == 0) {
    $('#' + instance + '_' + subSectionId + '_content').prepend('<table class="stdTable" id="' + instance + '_sectionInputRows_'+subSectionId+'" ><thead>' + $('#configurationSettings thead').clone().html() + '</thead><tbody></tbody></table>');
    if(instance == 'View') {
      $('#' + instance + '_sectionInputRows_'+subSectionId + ' thead th:gt(8)').hide();
      $('#' + instance + '_sectionInputRows_'+subSectionId + ' thead th:eq(6)').hide();
    }
  }
  if (inputType != 'section' && inputType != 'subSection') {
    $('#' + instance + '_sectionInputRows_'+ subSectionId + ' tbody').append('<tr>' + thisRow.clone().html() + '</tr>');
    thisRow.remove();
  }

}

function prepareAndLoadSetNames(defaultValue, formConfigurablePartsId) {
      var defaultValueName = defaultValue.attr('name');
      var defaultValueClass = defaultValue.attr('class');
      var defaultValueValue = defaultValue.val();
      defaultValue.replaceWith('<select name="' + defaultValueName + '" class="' + defaultValueClass + ' addSetNameList" value="'+ defaultValueValue +'" tabindex=1></select>');

      // load available setNames per setName input row
      $('[name="' + defaultValueName +'"]').load('/uniflow',
                              {stepName: 'Ajax Get setNames',
                               formConfigurablePartsId: formConfigurablePartsId},
                              function(data) {
                                // data cleanup
                                 $('[name="' + defaultValueName +'"]').children('option').remove();
                                // handle setName options
                                // if no setNames available, load blank option
                                if(data.length == 0) {
                                  $('[name="' + defaultValueName +'"]').append('<option value=""></option>');

                                }
                                // if more than 1 setName option available load blank option first
                                else if (data.match(/option/g).length > 2 && defaultValueValue.length == 0) {
                                  $('[name="' + defaultValueName +'"]').prepend('<option value=""></option>');
                                }
                                $('[name="' + defaultValueName +'"]').append(data);
                                // ensure that previously saved selection loads correctly
                                if (defaultValueValue.length > 0) {
                                    $('[name="' + defaultValueName +'"]').val(defaultValueValue);
                                    $('[name="' + defaultValueName +'"]').attr('value', defaultValueValue);
                                    $('[name="' + defaultValueName +'"]').children('[value="'+ defaultValueValue +'"]').attr('selected', true);
                                    $('[name="' + defaultValueName +'"]').children('[value="'+ defaultValueValue +'"]').prop('selected', true);
                                  }
                              }
                            );
}

// checks/unchecks section/subsection components based on including whole section/subsection
function includeSections() {
  $('[id $= "_includeAll"]').click(function() {
    var clickIdArray = $(this).attr("id").split("_");
    var instance = clickIdArray[0];
    var sectionClass = '.' + clickIdArray[1];
    var sectionId = '#' + clickIdArray[0] + '_' + clickIdArray[1] + '_content';
    if($(this).is(':checked')) {
      $(sectionId).find('.accessioningConfiguration_showField').each(function() {
        if(!$(this).is(':checked')) {
            $(this).click();
        }
      });
      $(sectionId).parent().siblings().children('.accessioningConfiguration_required, .accessioningConfiguration_readonly').prop('checked',true)
      $(sectionId).show();
      $(sectionId).prop('checked',true);
      $(sectionClass + ' ' + sectionId).prop('checked',true);
    } else {
      $(sectionId).find('.accessioningConfiguration_showField').each(function() {
        if($(this).is(':checked')) {
            $(this).click();
        }
      });
      $(sectionId).parent().siblings().children('.accessioningConfiguration_required, .accessioningConfiguration_readonly').prop('checked',false)
      $(sectionId).hide();
      $(sectionClass + ' ' + sectionId).prop('checked',false);
      $(sectionId).prop('checked', false);
    }
  });
}

$(function() {
   hideColumns('#orderReviewTable', 'hideColumn');
});

$(window).load(function() {

  hideColumns('#configurationSettings', 'hideColumn');

  // Disable checkboxes for always required items.
  $('.accessioningConfiguration_isRequired').each(function() {
    if($(this).val() == 1) {
      $(this).parent().siblings().children('.accessioningConfiguration_showField').prop('checked', true);
      $(this).parent().siblings().children('.accessioningConfiguration_showField').attr('checked', true);
      $(this).parent().siblings().children('.accessioningConfiguration_showField').attr('disabled','disabled');
    }
  });

  // Disable placeholders where disallowed.
  $('.accessioningConfiguration_allowPlaceholder').each(function() {
    if($(this).val() == 0) {
      $(this).parent().siblings().children('.accessioningConfiguration_placeHolder').hide();
      $(this).parent().siblings().children('.accessioningConfiguration_placeHolder').parent('td').append('<span>Placeholder not applicable.</span>');
    }
  });

  // Disable defaultValues where disallowed.
  $('.accessioningConfiguration_allowDefaultValue').each(function() {
    var inputType = $(this).parent().siblings().children('.accessioningConfiguration_inputType').val();
    var instance = $(this).parent().siblings().children('.accessioningConfiguration_instance').val();
    if( ($(this).val() == 0 || instance == 'View') && inputType != 'setName' && inputType != 'column_setName') {
      $(this).parent().siblings().children('.accessioningConfiguration_defaultValue').hide();
      $(this).parent().siblings().children('.accessioningConfiguration_defaultValue').parent('td').append('<span>Default value not applicable.</span>');
    }
  });

  // Disable screen labels where disallowed.
  $('.accessioningConfiguration_allowScreenLabel').each(function() {
    if($(this).val() == 0) {
      $(this).parent().siblings().children('.accessioningConfiguration_screenLabel').hide();
      $(this).parent().siblings().children('.accessioningConfiguration_screenLabel').parent('td').append('<span>Screen label not applicable.</span>');
    }
  });

  // Make all requestIds readonly.
  $(".accessioningConfiguration_inputName").each(function() {
    if( $(this).val() == 'requestId') {
      if( $(this).parent().siblings().children('.accessioningConfiguration_instance').val() == 'New'){
        $(this).parent().siblings().children('.accessioningConfiguration_showField, .accessioningConfiguration_required').prop('checked',false);
        $(this).parent().siblings().children('.accessioningConfiguration_showField, .accessioningConfiguration_required').attr('checked', false);
        $(this).parent().siblings().children('.accessioningConfiguration_readonly').prop('checked',true);
        $(this).parent().siblings().children('.accessioningConfiguration_showField, .accessioningConfiguration_required, .accessioningConfiguration_readonly').attr('disabled','disabled');
        // $(this).parent().siblings().children('.accessioningConfiguration_screenLabel').hide();
        // $(this).parent().siblings().children('.accessioningConfiguration_screenLabel').parent('td').append('<span>Screen label not applicable.</span>');
      } else if( $(this).parent().siblings().children('.accessioningConfiguration_instance').val() != 'New') {
        $(this).parent().siblings().children('.accessioningConfiguration_showField, .accessioningConfiguration_readonly').prop('checked',true);
        $(this).parent().siblings().children('.accessioningConfiguration_showField, .accessioningConfiguration_readonly').attr('checked', true);
        $(this).parent().siblings().children('.accessioningConfiguration_showField, .accessioningConfiguration_required, .accessioningConfiguration_readonly').attr('disabled','disabled');
      }
    }
  });


  // Disable all option for configuration level values
  $('.accessioningConfiguration_configSettingValue').each(function() {
    var sibling = $(this).parent().siblings();
    var inputType = sibling.children('.accessioningConfiguration_inputType').val();
    if($(this).val() == 1) {
      sibling.children('.accessioningConfiguration_screenLabel').hide();
      sibling.children('.accessioningConfiguration_screenLabel').siblings().hide();
      sibling.children('.accessioningConfiguration_placeHolder').hide();
      sibling.children('.accessioningConfiguration_placeHolder').siblings().hide();
      sibling.children('.accessioningConfiguration_required').hide();
      sibling.children('.accessioningConfiguration_readonly').hide();
      sibling.children('.accessioningConfiguration_readonly').siblings().hide();
      if (inputType == 'checkbox') {
        sibling.children('.accessioningConfiguration_defaultValue').hide();
        sibling.children('.accessioningConfiguration_defaultValue').siblings().hide();
      } else {
        sibling.children('.accessioningConfiguration_showField').hide();
      }
    }
  });


  // Remove all disabled field
  $('form').submit(function(event) {
    event.preventDefault();
    $('.ui-accordion-content').children().slideUp();
    $('input').prop("disabled", false);
    event.currentTarget.submit();
  });



  // stylize main configuration table prior to segregation into individual instances, section, subsections
  $('#configurationSettings .accessioningConfiguration_inputName').each(function() {
    // needed variables for stylizing config table
    var showField = $(this).parent('td').siblings().children('.accessioningConfiguration_showField');
    var instance = $(this).parent('td').siblings().children('.accessioningConfiguration_instance').val();
    var sectionId = $(this).parent('td').siblings().children('.accessioningConfiguration_section').val();
    var subSectionId = $(this).parent('td').siblings().children('.accessioningConfiguration_subSection').val();
    var inputType = $(this).parent('td').siblings().children('.accessioningConfiguration_inputType').val();
    var inputName = $(this).val();
    var formConfigurablePartsId = $(this).parent('td').siblings().children('.accessioningConfiguration_configPartId').val();
    var defaultValue = $(this).parent('td').siblings().children('.accessioningConfiguration_defaultValue');
    var defaultValueValue = defaultValue.attr('value');
    var defaultValueName = defaultValue.attr('name');
    var accordionId = instance + '_accordion';
    var accordionContentId = instance + '_' + sectionId + '_configurableInputs';
    var that = $(this);
    var thisRow = $(this).parent('td').parent('tr');
    var newRequestId = $(this).parent('td').siblings().children(".accessioningConfiguration_instance[value='New']").parent().siblings().children(".accessioningConfiguration_inputName[value='requestId']");
    // .children(".accessioningConfiguration_inputName[value='requestId']")
    // add span label and style to first visible column
    showField.parent().prepend('<div class="includeSection"><span class="accSysNameLabel">SYSTEM NAME: </span><br /><span class="accSysName" id="'+instance + '_' + inputName +'">' + $(this).val() + '</span></div>');

    //add classes to include inputs for correct includeSections() processing
    showField.addClass(sectionId);
    showField.addClass(subSectionId);



    if(instance == 'View') {
      $(this).parent().siblings().children('.accessioningConfiguration_placeHolder').parent('td').hide();
      //$(this).parent().siblings().children('.accessioningConfiguration_defaultValue').parent('td').hide();
      $(this).parent().siblings().children('.accessioningConfiguration_required').parent('td').hide();
      $(this).parent().siblings().children('.accessioningConfiguration_readonly').prop('checked',true);
      $(this).parent().siblings().children('.accessioningConfiguration_readonly').attr('checked',true);
      $(this).parent().siblings().children('.accessioningConfiguration_readonly').val('true');
      $(this).parent().siblings().children('.accessioningConfiguration_readonly').parent('td').hide();
    }

    // stylize sections
    if (inputType == 'section') {
      $('#' + instance).append('<h3>' + inputName + '</h3>')
                          .append('<div class="accordionContent" id="'+ accordionContentId + '"></div>');
      $('#' + accordionContentId).append('<table><tbody><tr class="includeSectionRow">' + thisRow.clone().html() + '</tr></tbody></table>');
      $('#' + accordionContentId).append('<div class="accordionSection" id="' + instance + '_' + sectionId + '_content"></div>');
      $('#' + accordionContentId + ' .includeSection').siblings('input').attr('id', instance + '_' + sectionId + '_includeAll');
      $('#' + accordionContentId + ' .includeSection').siblings('input').removeClass(sectionId);
      $('#' + accordionContentId + ' .includeSection').replaceWith('<span class="accSectionInput">' + inputName + '</span>');
      $('#' + accordionContentId + ' .includeSectionRow input:not(".accessioningConfiguration_showField")').parent().hide();
      thisRow.remove();
    }
    // stylize subsections
      else if (inputType == 'subSection') {
      $('#' + accordionContentId + ' #' + instance + '_' + sectionId + '_content').append('<table><tbody><tr class="includeSubSectionRow">' + thisRow.clone().html() + '</tr></tbody></table>');
      $('#' + accordionContentId + ' .includeSubSectionRow .includeSection').siblings('input').removeClass(subSectionId);
      $('#' + accordionContentId + ' .includeSubSectionRow .includeSection').siblings('input').attr('id', instance + '_' + subSectionId + '_includeAll');
      $('#' + accordionContentId + ' .includeSubSectionRow .includeSection').replaceWith('<span class="accSectionInput">' + inputName + '</span>');
      $('#' + accordionContentId + ' .includeSubSectionRow input:not(".accessioningConfiguration_showField")').parent().hide();
      $('#' + accordionContentId + ' #' + instance + '_' + sectionId + '_content').append('<div  class="accordionSubSection" id="' + instance + '_' + subSectionId + '_content"></div>');
      thisRow.remove();
    } else {

      // stylize inputs were setName selection is appropriate
     if(inputType == 'setName' || inputType == 'column_setName') {
         prepareAndLoadSetNames(defaultValue, formConfigurablePartsId);
        }

      // allow loading of all set names via ajax prior to segregating rows.
      setTimeout(
        function() {
          segregateRows(instance, sectionId, subSectionId, inputType, thisRow);
        },
        2000);

    }
    // Disable readonly and required sections if showField is unchecked
    showField.each(function () {
      if($(this).is(':checked') && $(this).parent().siblings().children('.accessioningConfiguration_readonly').is(':not(:disabled)') && $(this).parent().siblings().children('.accessioningConfiguration_required').is(':not(:disabled)')) {
        showField.parent().siblings().children('.accessioningConfiguration_required').prop('disabled',false);
        if(showField.parent().siblings().children('.accessioningConfiguration_instance').val() != 'View') {
        showField.parent().siblings().children(' .accessioningConfiguration_readonly').prop('checked',false);
      }
      }else{
        showField.parent().siblings().children('.accessioningConfiguration_required, .accessioningConfiguration_readonly').prop('disabled',true);
      }
    });

  });

  // Hide disabled sections on load
  $('[id $= "_includeAll"]').each(function() {
    var clickIdArray = $(this).attr("id").split("_");
    var instance = clickIdArray[0];
    var sectionClass = '.' + clickIdArray[1];
    var sectionId = '#' + clickIdArray[0] + '_' + clickIdArray[1] + '_content';
    if($(this).prop('checked') == false) {
      $(sectionId).prop('checked',false);
      $(sectionId).parent().siblings().children('.accessioningConfiguration_required').prop('checked',false);
      if($(sectionId).parent().siblings().children('.accessioningConfiguration_instance').val() != 'View') {
        $(sectionId).parent().siblings().children(' .accessioningConfiguration_readonly').prop('checked',false);
      }
      $(sectionId).hide();
    }
  });


  includeSections();

  $('#accessioningInstances').tabs();
  $('.accordion').accordion({
    heightStyle: "content",
    collapsible: true,
    active: false,
    create: function( event, ui ) {
      $('#accessioningInstances').show();
      $('#loadingProgress').hide();
      $('#stepFormSubmitButton').show();
      $('#copyOptions').show();
      $('.showWhenLoaded').show();
    }

  });

  // copy settings across instances
  $(document).on('click', '.ui-tabs-tab', function() {
    var currentInstanceTab = $(this).attr('aria-controls');
    $('#copyFrom').val(currentInstanceTab);
  });

  $('#copyButton').click(function() {
    var fromInstance = $('#copyFrom').val();
    var toArray = $('#copyTo').val().split('|');
    toArray = $.grep(toArray, function(value) {
                      return value != fromInstance;
                    });
    var toInstance = '';
    var thisSetting = '';
    var copyToSetting = '';
    var showField = '';
    var screenLabel = '';
    var placeholder = '';
    var defaultValue = '';
    var required = '';
    var readonly = '';
    var inputType = '';

    $.each(toArray, function(index,value) {
      toInstance = value;

      // Copy section settings, show/hide sections/subsections
      $('[id^="'+ fromInstance +'"][id$="_includeAll"]').each(function() {
        showField = $(this).prop('checked');
        thisSetting = $(this).attr('id');
        copyToSetting = toInstance + thisSetting.substring(thisSetting.indexOf('_'), thisSetting.length);

        $('#' + copyToSetting).prop('checked', showField);
        $('#' + copyToSetting).attr('checked', showField);
        $('#' + copyToSetting).val(showField);

        if(showField == true) {
          $('#' + copyToSetting.replace('_includeAll', '_content')).show();
        } else {
          $('#' + copyToSetting.replace('_includeAll', '_content')).hide();
        }

      });

      // Copy individual settings
      $('#' + fromInstance + ' .accSysName').each(function() {

        thisSetting = $(this).attr('id');
        copyToSetting = toInstance + thisSetting.substring(thisSetting.indexOf('_'), thisSetting.length);

          // Copy to all instances
          showField = $('#' + thisSetting).parent().parent('td').children('input.accessioningConfiguration_showField').prop('checked');
          $('#' + copyToSetting).parent().parent('td').children('input.accessioningConfiguration_showField').prop('checked',showField);

          screenLabel = $('#' + thisSetting).parent().parent('td').siblings().children('.accessioningConfiguration_screenLabel').val();
          $('#' + copyToSetting).parent().parent('td').siblings().children('.accessioningConfiguration_screenLabel').val(screenLabel);

          inputType = $('#' + thisSetting).parent().parent('td').siblings().children('input.accessioningConfiguration_inputType').val();

          if(toInstance == 'View' && (inputType == 'setName' ||  inputType == 'column_setName')) {
            defaultValue = $('#' + thisSetting).parent().parent('td').siblings().children('.accessioningConfiguration_defaultValue').val();
            $('#' + copyToSetting).parent().parent('td').siblings().children('.accessioningConfiguration_defaultValue').val(defaultValue);
          }
          // Does not apply to View instance
          else if(toInstance != 'View') {
            placeholder = $('#' + thisSetting).parent().parent('td').siblings().children('.accessioningConfiguration_placeHolder').val();
            $('#' + copyToSetting).parent().parent('td').siblings().children('.accessioningConfiguration_placeHolder').val(placeholder);

            defaultValue = $('#' + thisSetting).parent().parent('td').siblings().children('.accessioningConfiguration_defaultValue').val();
            $('#' + copyToSetting).parent().parent('td').siblings().children('.accessioningConfiguration_defaultValue').val(defaultValue);

            required = $('#' + thisSetting).parent().parent('td').siblings().children('.accessioningConfiguration_required').prop('checked');
            $('#' + copyToSetting).parent().parent('td').siblings().children('.accessioningConfiguration_required').prop('checked',required);
            $('#' + copyToSetting).parent().parent('td').siblings().children('.accessioningConfiguration_required').prop("disabled", false);

            readonly = $('#' + thisSetting).parent().parent('td').siblings().children('.accessioningConfiguration_readonly').prop('checked');
            $('#' + copyToSetting).parent().parent('td').siblings().children('.accessioningConfiguration_readonly').prop('checked',readonly);
            $('#' + copyToSetting).parent().parent('td').siblings().children('.accessioningConfiguration_readonly').prop("disabled", false);
          }

      });

    });
  });

  // make all hidden values not readonly or required (cannot select for the showField checkbox for some reason)
  $(document).on('click', '.accessioningConfiguration_showField', function () {
    if($(this).is(':not(:checked)')) {
      $(this).parent().siblings().children('.accessioningConfiguration_required').prop('checked',false);
      if($(this).parent().siblings().children('.accessioningConfiguration_instance').val() != 'View') {
        $(this).parent().siblings().children(' .accessioningConfiguration_readonly').prop('checked',false);
      }
      $(this).parent().siblings().children('.accessioningConfiguration_required, .accessioningConfiguration_readonly').prop("disabled", true);
    } else {
      $(this).parent().siblings().children('.accessioningConfiguration_required, .accessioningConfiguration_readonly').prop("disabled", false);
    }
  });

  // if required is checked, then readonly cannot be checked
  $(document).on('click', '.accessioningConfiguration_required', function () {
    if($(this).is(':checked')) {
      $(this).parent().siblings().children('.accessioningConfiguration_readonly').prop('checked',false);
    }
  });

// if readonly is checked, then required cannot be checked
  $(document).on('click', '.accessioningConfiguration_readonly', function () {
    if($(this).is(':checked')) {
      $(this).parent().siblings().children('.accessioningConfiguration_required').prop('checked',false);
    }
  });

});

