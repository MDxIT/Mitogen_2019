
$(window).load(function() {
  var instance = $("#instance").val();
  if(instance === "View") {
    $("#stepFormSubmitButton").remove();
    $("#accessioningAccordions").find("input[type=button]").remove();
    $("#accessioningAccordions").find("input[type=checkbox]").prop('disabled', true);
    $("#accessioningAccordions").find("select").prop('disabled', true);
  }

  if(instance == 'Edit' || instance == 'View'){
    $('#specimenInfo_EnterSamples').hide();
    if(instance == 'Edit'){
      $('#specimenInfoTable tbody tr td .specimenInfo_specimenId').each( function() {
        if( $(this).val() == '' ){
          $(this).parent('td').siblings().children('.specimenEntry').attr('data-parsley-required', 'false');
        }
      });
    }
  }


  $('.headerTable').parent().css({'width':'100%'});
  var workflow = $("#hiddenWorkflow").val();
  var accordionSection = document.getElementsByClassName("accordionSection");
  var $accordion = $('.accordion').accordion({
      heightStyle: "content",
      collapsible: true,
      active: false,
      create: function( event, ui ) {
        $('#loadingProgress').hide();
        $('#stepFormSubmitButton').show();
        $('.accordion').show();
        $(".formViewAllButton").val("Collapse All");
        $(".accordionSection:not(.ui-state-active)").each(function() {
          $(this).addClass("ui-state-active");
          $(this).next().toggle();
        });
        $(".ui-accordion-header-icon").each( function() {
          $(this).addClass("ui-icon-triangle-1-s");
          $(this).removeClass("ui-icon-triangle-1-e");
        });
      }
  });

  $(".formViewAllButton").click(function(){
    if($(".formViewAllButton").val() == "Expand All") {
      $(".formViewAllButton").val("Collapse All");
      $(".accordionSection:not(.ui-state-active)").each(function() {
        $(this).addClass("ui-state-active");
        $(this).next().toggle();
      });
      $(".ui-accordion-header-icon").each( function() {
        $(this).addClass("ui-icon-triangle-1-s");
        $(this).removeClass("ui-icon-triangle-1-e");
      });
    }else{
      $(".formViewAllButton").val("Expand All")
      $(".ui-state-active").each(function() {
        $(this).removeClass("ui-state-active");
        $(this).next().toggle();
      });
      $(".ui-accordion-header-icon").each( function() {
        $(this).addClass("ui-icon-triangle-1-e");
        $(this).removeClass("ui-icon-triangle-1-s");
      });
    }
  });

  $('.lastOfAccordionSection').focus(function() {
    var current = $accordion.accordion("option","active"),
        maximum = $accordion.find("h3").length,
        next = current+1 === maximum ? 0 : current+1;
    // $accordion.accordion("activate",next); // pre jQuery UI 1.10
    $accordion.accordion("option","active",next);
  });

});
