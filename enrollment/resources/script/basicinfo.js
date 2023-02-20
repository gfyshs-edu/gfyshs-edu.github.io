window.onload = initForms;
var selectedcountry = "php";

function initForms() {
   //for showing "see registrar message" for citizenship
   if ($('#nationality').prop("selectedIndex") == 0 || $('#nationality').prop("selectedIndex") == 1) {
      $('#citizen_notice').hide();
      $('#citizen_notspecified').hide();
   } else {
       if ($('#nationality').val() == "9999") {
          $('#citizen_notice').hide(); 
          $('#citizen_notspecified').show();
       } else {
          $('#citizen_notice').show(); 
          $('#citizen_notspecified').hide();
       }
      
   }
   $('#nationality').change(function() {
       if ($('#nationality').prop("selectedIndex") == 0 || $('#nationality').prop("selectedIndex") == 1) {
          $('#citizen_notice').hide();
          $('#citizen_notspecified').hide();
       } else {
            if ($('#nationality').val() == "9999") {
               $('#citizen_notice').hide(); 
               $('#citizen_notspecified').show();
            } else {
               $('#citizen_notice').show(); 
               $('#citizen_notspecified').hide();
            }
       }
   });

   $('#religion').change(function() {
         if(($(this).val() == 20) || $(this).val() == 18) {
             $('#religionState').show();
         } else {
             $('#religionState').hide();
         }
   });

   if ($("#religion").val() == 20 || $("#religion").val() == 18) {
      $('#religionState').show();
   } else {
      $('#religionState').hide();
   }
   
   $('#province').change(function() {
       populateCity($(this));
   });
   
    $('#country').change(function() {
        cleanProvinceCity($(this).prop("selectedIndex"))
        provinceCityVisibility($(this).prop("selectedIndex"));
    });
    
    provinceCityVisibility($('#country').prop("selectedIndex"));
    
    var optIC = $("input[name='withIntCred']:checked");
    if (optIC.length > 0) {
        if (optIC.val() == '1') {
            $('#intcreddiv').show();
        } else if (optIC.val() == '0') {
            $('#intcreddiv').hide();
        }
    } else {
        $('#intcreddiv').hide();
    }
    
    optionOnChange('withIntCred', $('#intcreddiv'));
}

function optionOnChange(optionName, div1) {
    $('input[type=radio][name=' + optionName + ']').change(function() {
        if (this.value == 1) {
            div1.show();
        } else if (this.value == 0) {
            div1.hide();
        } else {
            div1.hide();
        }
    });
}

function provinceCityVisibility(mode) {
    if (mode == 0) {
        $('.php').removeClass("sr-only");
        $('.nonphp').addClass("sr-only");
        selectedcountry = "php";
    } else {
        $('.php').addClass("sr-only");
        $('.nonphp').removeClass("sr-only");
        selectedcountry = "nonphp";
    }
}

function cleanProvinceCity(mode) {
    if ((selectedcountry == "nonphp" && mode == 0) ||
        (selectedcountry == "php" && mode != 0)) {
        
        $('#province').prop('selectedIndex', 0);
        $('#province_name').val('');
        $('#city').empty().append('<option></option>');
        $('#city_name').val('');
        $('#barangay').val('');
        $('#district').val('');
    } 
}

function populateCity(obj) { 
    var helper = "#cityHelp";
    var dropdown = "#city";
    
    if (obj.prop("selectedIndex") != 0) {
        var codes = obj.val();
        var splitValues = codes.split("-");
        var r_code = splitValues[0];
        var p_code = splitValues[1];
        
        $(helper).html("Updating city please wait...");
        $(helper).removeClass("sr-only");
        
        $.post('educbackreq', {
                procNumber: 1,
                reg: r_code,
                prov: p_code,
                }, function(xml) {
                    if($("resultNumber",xml).text() == "1") {
                        $(dropdown).empty().append('<option value="0">Select a city</option>');
                        
                        $("city_values",xml).each(function(id) {
                            subValues = $("city_values",xml).get(id);
                            $(dropdown).append(
                                 $('<option></option>').val($("code",subValues).text()).html($("name",subValues).text())
                             );
                        });
                        
                        $(helper).html("");
                        $(helper).removeClass("sr-only");
                    } else {
                        $(helper).html($("resultMsg",xml).text());
                    }
                
        });
        
    } else {
     $(helper).html("");
     $(helper).removeClass("sr-only");
     $(dropdown).empty().append('<option></option>');
    }
}

function Validate() {
    var familyName = document.getElementById('surname');
	if (check_field(familyName)) {
	   alert("Family name is required");
	   familyName.focus();
	   return false;
	}
	
	var firstName = document.getElementById('firstName');
	if (check_field(firstName)) {
	   alert("First name is required");
	   firstName.focus();
	   return false;
	}
	
	var middleName = document.getElementById('middleName');
	if (check_field(middleName)) {
	   alert("Middle name is required");
	   middleName.focus();
	   return false;
	}
	
	var gender = document.getElementById('gender');
	if (gender.selectedIndex == 0) {
	   alert("Please select your gender");
	   gender.focus();
	   return false;
	}
	
	var birthdate = document.getElementById('birthdate');
	if (check_field(birthdate)) {
	   alert("Birthdate is required");
	   birthdate.focus();
	   return false;
	}
        else {
           now = new Date();
           bd = document.getElementById('birthdate').value;
           bdyr = bd.substring(6,10);
           //alert(bdyr);
           
           currdate = new Date();
           curryr = currdate.getFullYear();
           //alert(curryr);
                
            if (curryr - bdyr < 10){
                alert("Invalid year of birth");
                birthdate.focus();
                return false;
            }
			
            if (date_format(birthdate)) {
                alert("Invalid Birthdate format!\nPlease input mm/dd/yyyy. e.g.\nDecember, 10, 2000. It should be 12/10/2000");
                birthdate.focus();
                return false;
            }
        }
        
        var citizenship = $('#nationality').prop("selectedIndex");
        if (citizenship == 0) {
            alert("You need to select your citizenship");
            $('#nationality').focus();
            return false;
        }
        
        var nationality = document.getElementById('nationality');
        document.getElementById('nationalityName').value = nationality.options[nationality.selectedIndex].text;
        
        var religion = document.getElementById("religion");
        var relcode = religion.options[religion.selectedIndex].value;
        if (relcode == "0") {
            alert("You need to select your religion");
            religion.focus();
            return false;
        }
        else if ((relcode == "18") || (relcode == "20")) {
            var txtrel = document.getElementById("txtReligionName");
            if (check_field(txtrel)) {
                alert("You need to state your religion");
                txtrel.focus();
                return false;
            }
        }
        
        if (relcode != "0") {
            document.getElementById("relName").value = religion.options[religion.selectedIndex].text;
        }
        
         var countryIndex = $('#country').prop("selectedIndex");
         if (countryIndex == 0) {
             if ($('#province').prop("selectedIndex") == 0) {
                 alert("Please select a province");
                 $('#province').focus();
                 return false;
             }
             
             if ($('#city').prop("selectedIndex") == 0) {
                 alert("Please select a city");
                 $('#city').focus();
                 return false;
             }
         } else {
            if (check_fieldQ($('#province_name'))) {
                 alert("Province/State is required");
                 $('#province_name').focus();
                 return false;
             }
             
            if (check_fieldQ($('#city_name'))) {
                 alert("City is required");
                 $('#city_name').focus();
                 return false;
             }
         }
         
        if (check_fieldQ($('#houseno'))) {
            alert("House No. is required");
            $('#houseno').focus();
            return false;
        }
        
        if (check_fieldQ($('#street'))) {
            alert("Street is required");
            $('#street').focus();
            return false;
        }
        
         if (countryIndex == 0) {
            if (check_fieldQ($('#barangay'))) {
                alert("Barangay is required");
                $('#barangay').focus();
                return false;
            }
             
//            if (check_fieldQ($('#district'))) {
//                alert("District is required");
//                $('#district').focus();
//                return false;
//            }
         }
	
	var h_postal = document.getElementById('postal');
	if (check_field(h_postal)) {
	   alert("zip code is required");
	   h_postal.focus();
	   return false;
	}
        
	var mobileNumber = document.getElementById('mobileNo');
	if (check_field(mobileNumber)) {
	   alert("Mobile Number is required");
	   mobileNumber.focus();
	   return false;
	}
	
	var emailID = document.getElementById("email");
	if (check_field(emailID)) {
	   alert("Email Address is required");
	   emailID.focus();
	   return false;
	} else {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(reg.test(emailID.value) == false) {
               alert('Invalid Email Address');
               emailID.focus()
               return false;
            }
        }
        
	var p_emailID = document.getElementById("pemail");
	if (check_field(p_emailID)) {
	   alert("Parents Email Address is required");
	   p_emailID.focus();
	   return false;
	} else {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(reg.test(p_emailID.value) == false) {
               alert('Invalid Parents Email Address');
               p_emailID.focus()
               return false;
            } else {
                if ($("#email").val() == $("#pemail").val()) {
                   alert('Your Email Address should be different from your parents Email Address');
                   p_emailID.focus()
                   return false; 
                }
            }
        }
        
    var vacc = $("input[name='vaccine']:checked");
    if (vacc.length == 0) {
        alert("Please answer\nAre you fully vaccinated (1st and 2nd dose) against COVID19?");
        return false;    
    }
    
    if ($('#intcreddiv').length) {
        var optIC = $("input[name='withIntCred']:checked");
        if (optIC.length > 0) {
            if (optIC.val() == '1') {
                if ($('#intCredentials').prop("selectedIndex") == 0) {
                   alert("Please select an International Credential");
                   $('#intCredentials').focus();
                   return false;
                }
            }
        } else {
            alert("Please answer\nDo you have an International Credentials?");
            return false;
        }
        
        $('#intlCredLabel').val($( "#intCredentials option:selected" ).text());
    }
    
        $('#countryName').val($( "#country option:selected" ).text());
        if (countryIndex == 0) {
            $('#province_name').val($( "#province option:selected" ).text());
            $('#city_name').val($( "#city option:selected" ).text());
        }
        
    return true;
}

function validateOtherInfo(questionDiv, gradeLevel, optionName, inputId) {
    var gradeTenDiv = document.getElementById(questionDiv);
    rb = gradeTenDiv.getElementsByTagName("input");
    unclicked = true;
    for (i = 0; i < rb.length; i++) {
        if (rb[i].checked) {
           unclicked = false;
        }
    }
    if (unclicked) {
       alert("Please answer Did you take up your Grade " + gradeLevel + " at University of Santo Tomas Manila?");
       return false;
    }
    
    if ($('input[type=radio][name=' + optionName + ']:checked').val() == 1 && $('#' + inputId).val().trim().length == 0) {
           alert("Grade " + gradeLevel + " Student Number is required");
           $('#' + inputId).focus();
           return false;
    }
    
    return true;
}

function date_format(birthdate) {
	var dateformat = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}$/;
	var Val_date = birthdate.value;
	if(Val_date.match(dateformat)) {
	   var seperator1 = Val_date.split('/');
	   if (seperator1.length>1) {
           var splitdate = Val_date.split('/');
       }
	   var dd = parseInt(splitdate[1]);
	   var mm  = parseInt(splitdate[0]);
	   var yy = parseInt(splitdate[2]);
	   var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
	   if (mm==1 || mm>2) {
		  if (dd>ListofDays[mm-1]) {
			  return true;
		  }
	   }
	   if (mm==2) {
		  var lyear = false;
		  if ( (!(yy % 4) && yy % 100) || !(yy % 400)) {
			  lyear = true;
		  }
		  if ((lyear==false) && (dd>=29)) {
			  return true;
		  }
		  if ((lyear==true) && (dd>29)) {
			  return true;
		  }
	   }
	   return false;
	} else {
		return true;
	}
}

 function check_field(obj) {
   var y = obj.value;
    y = y.replace(/^\s*|\s*$/g,"");
	if ((y == "") || (y == null)) {
		return true;
	}
   return false;
 }
 
 function check_fieldQ(obj) {
   var y = obj.val();
    y = y.replace(/^\s*|\s*$/g,"");
	if ((y == "") || (y == null)) {
		return true;
	}
   return false;
}

function hideShowDiv(divFieldSet, objFieldSet, objName, eqValue) {
   divFieldSet.find('input:radio').on('click', function() {
	   if (this.value == eqValue) {
		   objFieldSet.show();
	   } else {
		   objFieldSet.hide();
		   if (objName != '') {
		     objName.val('');
		   }
	   }
   });
}

function otherInfoOptionsClick(questionDiv, studnumDiv, optionName) {
    var gradeTenDiv = document.getElementById(questionDiv);
    var rb = gradeTenDiv.getElementsByTagName("input");
    var unclicked = true;
    for (var i = 0; i < rb.length; i++) {
        if (rb[i].checked) {
           unclicked = false;
        }
    }
    if (unclicked) {
       $("#" + studnumDiv).hide();
    } else {
        if ($('input[type=radio][name=' + optionName + ']:checked').val() == 0) {
            $("#" + studnumDiv).hide();
        }
    }
}