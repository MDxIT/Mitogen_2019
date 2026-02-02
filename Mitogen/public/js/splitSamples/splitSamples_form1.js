
// Form 1
$(document).ready(function() {
    var minSamples = parseInt($('#splitSample_minSamples').val());
    var quantityRequired = $('#quantityRequired').val();
    var unitsRequired = $('#unitsRequired').val();
    var enableTestAndMethods = $('#enableTestAndMethods').val();
    var enableParentTestAndMethods = $('#enableParentTestAndMethods').val();

    var $p_quantity = $('#splitSample_parent_quantity');
    var $p_units = $('#splitSample_parent_units');
    var $p_method = $('#splitSample_parent_testMethod');
    var $p_test = $('#splitSample_parent_test');
    var $p_panel = $('#splitSample_parent_panel');
    var $p_action = $('#specimenId_Action');

    hideColumns('#splitSample_table', 'hideColumn')

    // Hides column based on config.
    hideColumnBasedOnConfig('#splitSample_table', '#enablePrint', 'Print');
    hideColumnBasedOnConfig('#splitSample_table', '#enableComments', 'Comments');
    hideColumnBasedOnConfig('#splitSample_table', '#enableTestAndMethods', 'Test');
    hideColumnBasedOnConfig('#splitSample_table', '#enableTestAndMethods', 'Method');
    hideColumnBasedOnConfig('#splitSample_table', '#enableTestAndMethods', 'Panel');

    checkIfRequired($p_action, 'Yes');

    // parsley validation for checking each quantity child elem if <= parent quantity
    $('.splitSample_quantity').attr('data-parsley-less-than-or-equal-to-parent', '');
    addParsleyQuantitySumValidation();

    $('#setActionAll').click(function() {
        var actionAll = $('#actionForAll').val();
        $('.splitSample_action').val(actionAll);
         $('.splitSample_action').change();
    });

    $('#setQuantityAll').click(function() {
        var quantityAll = $('#quantityForAll').val();
        $('.splitSample_quantity').val(quantityAll);
    });

    // Adds min. samples by default without having to click the add row button
    if(isNaN(minSamples) == false) {
        minSamples -= 1;
        for(var i = 0; i < minSamples; i++) {
            // false to keep print data for sample information
            inputTableAddRowWithRemove('splitSample_table', false);
        }
       $('.splitSample_units').val($('#splitSample_parent_units').val());
    }


    var listVariables = ['.splitSample_containerId']
    printTableInputBarcodeByClass('#splitSample_table', '.printButton');
    $('#printDocument').hide();

    checkIfRequired($p_quantity, quantityRequired, true);
    checkIfRequired($p_units, unitsRequired);
    checkIfRequired($p_panel, enableParentTestAndMethods);

    $(document).on('change', '#splitSample_parent_units', function() {
        $('.splitSample_units').val($(this).val());
    });


    // Adds a new empty row to the table
    $(document).on('click', '#splitSample_addRow', function() {
        // Clearing sample container Id because hidden data needs to remain the same for printing functionality.
        inputTableAddRowWithRemove('splitSample_table', false);
        $('.splitSample_units').val($('#splitSample_parent_units').val());
        var $lastRow = $('#splitSample_table tbody tr').last();
        $lastRow.find('.splitSample_units, .splitSample_quantity').removeAttr('required').removeClass('required');
        // Clearing sample container Id because hidden data needs to remain the same for printing functionality.
        $lastRow.find('.splitSample_containerId').val('');
        // Triggering change for empty container id to properly sort required fields.
        $('.splitSample_containerId').trigger('change');
        $lastRow.find('.printBarcodeBtn').removeAttr('name').val('Print') // this line must be here for add row to work with the addition of print buttons.

        $('.stdRow').change( function() {
            if(($('#resourcesIncludedSetting').val()).toLowerCase() != 'no'){
                masterMixFunction();
            }
        });
    });

    if(enableParentTestAndMethods === 'No'){
        $('#parentSampleAssay').hide();
    }

    // Load parent method select box
    loadParentTest();

    $(document).on('change', '#splitSample_parent_panel', function() {
        loadParentTest();
    });
    $(document).on('change', '#splitSample_parent_test', function() {
        loadParentMethod();
    });

    // Dynamically set required fields (quantity, units, methods, and test) when
    // changing .splitSample_containerId
    $(document).on('change', '.splitSample_containerId', function() {
        var $quantity = $(this).parent().siblings().find('.splitSample_quantity');
        var $units = $(this).parent().siblings().find('.splitSample_units');
        var $panel = $(this).parent().siblings().find('.splitSample_panel');
        var $action = $(this).parent().siblings().find('.splitSample_action');
        var $clearAliquot = $(this).parent().siblings().find('.clearAliquot');
        var $aliquot = $(this);

        $aliquot.attr('value', $aliquot.val());

        if($aliquot.val() != '') {

            // Check if new container
            var request = {
                stepName: 'Ajax Is Container',
                inputId: $aliquot.val()
            };
            $.getJSON('uniflow?', request).done( function(data) {
                if(data[0].isContainer == 'YES' && $('#sampleIdGen').val() != 'Use Existing Identifier') {
                    alert($aliquot.val() + ' already exist in the database. You must use a unique container id for aliquots.');
                    $aliquot.val('');
                    $aliquot.focus();
                } else {
                    if($('.splitSample_containerId[value="'+ $aliquot.val()+'"]').length > 1) {
                        alert('You have entered this sample id previously on the form. You must use a unique container id for aliquots.');
                        $aliquot.val('');
                        $aliquot.focus();
                    } else {

                        checkIfRequired($quantity, quantityRequired, true);
                        checkIfRequired($units, unitsRequired);
                        checkIfRequired($action, 'Yes');
                    }

                }
            });
        } else {
            $clearAliquot.val('');
            checkIfRequired($quantity, 'No', true);
            checkIfRequired($units, 'No');
            checkIfRequired($panel, 'No');
            checkIfRequired($action, 'No');
        }
    });

    // load methods (on load) for each rows
    $('.splitSample_containerId').each(function() {
        var $test = $(this).parent().siblings().find('.splitSample_test');
        var testCode = $test.val();
        var $method = $(this).parent().siblings().find('.splitSample_testMethod');
        if($(this).val() != '' && testCode != '') {
           loadMethods($method, testCode);
        }
    });

    $(document).on('change', '.splitSample_action', function() {
        var $panel = $(this).parent().siblings().find('.splitSample_panel');
        var $test = $(this).parent().siblings().find('.splitSample_test');
        var $method = $(this).parent().siblings().find('.splitSample_testMethod');
        var $action = $(this);
        if($action.val() == 'route') {
            checkIfRequired($panel, enableTestAndMethods);
        } else {
            checkIfRequired($panel, 'No');
        }

    })

    // Load tests when changing .splitSample_panel
    $(document).on('change', '.splitSample_panel', function() {
        var $test = $(this).parent().siblings().find('.splitSample_test');
        var panelCode = $(this).val();

        if(panelCode != '') {
            loadTests($test, panelCode);
        }
    });
    // Load methods when changing .splitSample_test
    $(document).on('change', '.splitSample_test', function() {
        var $method = $(this).parent().siblings().find('.splitSample_testMethod');
        var testCode = $(this).val();

        if(testCode != '') {
            loadMethods($method, testCode);
        }
    });


    // Search for duplicates when changing .splitSample_testMethod
    $(document).on('change', '.splitSample_testMethod', function() {
        var methodSelected = $(this).val();
        var testCode = $(this).parent().siblings().find('.splitSample_test').val();
        var key = testCode + '-' + methodSelected;
        var $thisRow = $(this).parent().parent('tr');
        if($(this).parent().siblings().children('.splitSample_action').val() == 'route') {
            $thisRow.attr('testmethod', key);
            searchForDuplicateTests($thisRow, key);
        }

    });

    // Verify total quantities (children) <= parent quantity
    $('form #stepFormSubmitButton').on('click', function(event) {
        event.preventDefault();
        $('form').parsley().validate();
        if($('form').parsley().isValid()) {
            if(quantityRequired == 'No') {
                $('form').submit();
                return true;
            }

            var parent_quantity = parseInt($('#splitSample_parent_quantity').val());
            var children_quantity = 0;
            $('.splitSample_containerId').each(function() {
                if($(this).val() != '') {
                    var quantity = parseInt($(this).parent().siblings().children('.splitSample_quantity').val());
                    if(isNaN(quantity) == false) {
                        children_quantity += quantity;
                    }
                }
            });
            if(children_quantity <= parent_quantity) {
                $('form').submit();
            } else {
                alert('Total quantity of all aliquots must be less than or equal to the parent quantity');
            }
        }
    });

    function searchForDuplicateTests($thisRow, testMethod) {
        var testMethodCount = $('[testmethod="' + testMethod + '"]').length;
        if(testMethodCount > 1) {
            $thisRow.children().children('.splitSample_test').val('');
            $thisRow.children().children('.splitSample_test').focus();
            $thisRow.children().children('.splitSample_testMethod').val('');
            $thisRow.removeAttr('testmethod');
            alert('You have already selected this test and method pair for another Aliquot. Please select a different pair');
        }
    };

    function loadParentTest() {
        var $test = $('#splitSample_parent_test');
        var $panel = $('#splitSample_parent_panel');
        var panelCode = $panel.val();

        if(panelCode != '') {
            loadTests($test, panelCode);
        }
        $('#splitSample_parent_test').change();
    }

    function loadParentMethod() {
        var $method = $('#splitSample_parent_testMethod');
        var $test = $('#splitSample_parent_test');
        var testCode = $test.val();

        if(testCode != '') {
            loadMethods($method, testCode);
        }
    }

    function loadTests($elem, panelCode) {
        var value = $elem.val();
        $elem.load('/uniflow', {
            stepName: 'Ajax get tests for panel',
            panelCode: panelCode
        }, function() {
            $elem.prepend('<option></option>');
            $elem.val('');
            var children = $(this).children('option');
            var found = false;
            for(var i = 0; i < children.length; i++) {
                var $child = $(children[i]);
                if($child.val() == value) {
                    $child.attr('selected', true);
                    $elem.val(value).change();
                    found = true;
                    break;
                }
            }
        });
    }

    function loadMethods($elem, testCode) {
        var value = $elem.val();
        $elem.load('/uniflow', {
            stepName: 'Ajax get methods for tests',
            testCode: testCode
        }, function() {
            $elem.prepend('<option></option>');
            $elem.val('');
            var children = $(this).children('option');
            var found = false;
            for(var i = 0; i < children.length; i++) {
                var $child = $(children[i]);
                if($child.val() == value) {
                    $child.attr('selected', true);
                    $elem.val(value).change();
                    found = true;
                    break;
                }
            }
        });
    }

    function checkIfRequired($elem, required, isNum) {
        if(required == 'Yes') {
            var readonly = $elem.prop('readonly');
            if(readonly === undefined || readonly === false) {
                $elem.addClass('required');
                $elem.attr('required', 'required');
                if(isNum) {
                    $elem.attr('data-parsley-pattern', '\\d+');
                }
            }
        } else {
            $elem.removeClass('required');
            $elem.removeAttr('required');
            $elem.removeAttr('data-parsley-pattern');
        }
    }

    function addParsleyQuantitySumValidation() {
        window.Parsley.addValidator('lessThanOrEqualToParent', {
            validateString: function(value, requirement, elem) {
                var parent_quantity = parseInt($('#splitSample_parent_quantity').val());
                var quantity = parseInt(value);
                if(isNaN(value) == false && isNaN(parent_quantity) == false) {
                    return value <= parent_quantity;
                }
                return false;
            },
            messages: {
                en: 'Quantity must be less than or equal to parent specimen quantity'
            }
        });

    }


});

