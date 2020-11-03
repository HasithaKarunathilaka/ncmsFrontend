

function ajaxErrorHandle(jqXhr, redirect = false) {
    if (jqXhr.responseJSON != null) {
        let errors = '';
        $.each(jqXhr.responseJSON.errors, function (key, error) {
            errors = errors + '<li>' + error + '</li>';
        });
        let printStr = '<div class="alert alert-danger alert-dismissible mt-3 fade show errorMessage" role="alert"><strong>Error!</strong> Operation failed. Please check the errors and retry.<ul>' + errors + '</ul><button type="button" class="close"data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        $('#title').after(printStr);
    } else {
        toastr.error('Something went wrong!', 'Error');
    }

    if (redirect){
        window.location.replace("doctor.html");
    }
}

function getPatientsDetailsList(accessBy, hospitalId) {
    if(accessBy == "moh"){
        var i = 1;
        $.ajax({
            type: "GET",
            url: 'http://localhost:8080/patient/list?reason=fullDetails&userType='+accessBy+'&userId=moh',
            dataType: "json",
            success: function (data, status, xhr) {
                $.each(data, function(key, patientDetail){
                    let sLevel = "";
                    let state = "";
                    if(patientDetail.severityLevel == null){
                        sLevel = "Processing..";
                    }else {
                        sLevel = patientDetail.severityLevel;
                    }
                    if(patientDetail.admit_date == null && patientDetail.discharge_date == null){
                        state = "Not Admitted";
                    }else if (patientDetail.discharge_date == null){
                        state = "Admitted";
                    }else{
                        state = "Discharged";
                    }
                    let printStr = '<tr><td>' + i + '</td><td>' + patientDetail.id + '</td><td>' + patientDetail.firstName + '</td><td>' + patientDetail.lastName +'</td><td>' + patientDetail.gender + '</td><td>' + patientDetail.age + '</td><td>' + patientDetail.district + '</td><td>' + sLevel + '</td><td>' + state + '</td></tr>';
                    $('#patientsDetailsList tr:last').after(printStr);
                    i++;
                });
            },
            error: function (jqXhr, textStatus, errorMessage) {
                // alert("Error");
                ajaxErrorHandle(jqXhr);
            }
        });

    }else if(accessBy == "doctor" || accessBy == "director"){
        // alert("Start");
        var i = 1;
        $.ajax({
            type: "GET",
            url: 'http://localhost:8080/patient/list?reason=fullDetails&userType='+accessBy+'&userId='+hospitalId,
            dataType: "json",
            success: function (data, status, xhr) {
                $.each(data, function(key, patientDetail){
                    let sLevel = "";
                    let state = "";
                    if(patientDetail.severityLevel == null){
                        sLevel = "Processing..";
                    }else {
                        sLevel = patientDetail.severityLevel;
                    }
                    if(patientDetail.admit_date == null && patientDetail.discharge_date == null){
                        state = "Not Admitted";
                    }else{
                        state = "Admitted";
                    }
                    if (state == "Admitted"){
                        let patientId = patientDetail.id;
                        var details = new Array(patientDetail.id,patientDetail.firstName,patientDetail.lastName, patientDetail.district, patientDetail.xCoordinate, patientDetail.yCoordinate,patientDetail.gender,patientDetail.contact,patientDetail.email,patientDetail.age,sLevel,patientDetail.admit_date);
                        let printStr = '<tr><td>'+i+'</td><td>' + patientDetail.firstName + '</td><td>' + patientDetail.lastName +'</td><td>' + patientDetail.gender + '</td><td>' + patientDetail.age + '</td><td>' + patientDetail.district + '</td><td>'+patientDetail.bedId+'</td><td>'+sLevel+'</td><td>'+state+'</td><td><a href="../doctor/updatePatient.html?details='+details+'"><input type="button" id="btnUpdate" value="UPDATE"  onclick=""></a></td></tr>';
                        $('#dPatientsDetailsList tr:last').after(printStr);

                    }else{
                        let printStr = '<tr><td>'+i+'</td><td>' + patientDetail.firstName + '</td><td>' + patientDetail.lastName +'</td><td>' + patientDetail.gender + '</td><td>' + patientDetail.age + '</td><td>' + patientDetail.district + '</td><td>'+patientDetail.bedId+'</td><td>'+sLevel+'</td><td>'+state+'</td><td><input type="button" value="UPDATE" disabled="true" style="background-color: #999999"></td></tr>';
                        $('#dPatientsDetailsList tr:last').after(printStr);
                    }

                    i++;
                });
                // alert("SS");
            },
            error: function (jqXhr, textStatus, errorMessage) {
                // alert("Error");
                ajaxErrorHandle(jqXhr);
            }
        });
    }
}

function getOnlinePatientsDetailsList(userType, hospitalId){
    var i = 1;
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/patient/list?reason=onlineDetails&userType=doctor&userId='+hospitalId,
        dataType: "json",
        success: function (data, status, xhr) {
            $.each(data, function(key, patientDetail){
                let patientId = patientDetail.id;
                if(patientDetail.admit_date == null){
                    let printStr = '<tr><td>' + patientId + '</td><td><input type="button" name="admitButton" id="admitButton" value="ADMIT" onclick="readyToAdmit('+i+')"></td></tr>';
                    $('#patientsDetailsList tr:last').after(printStr);
                }else if(userType == "director"){
                    let printStr = '<tr><td>' + patientId + '</td><td><input type="submit" name="dischargeButton" id="dischargeButton" value="DISCHARGE" onclick="readyToDischarge('+i+')"></td></tr>';
                    $('#patientsDetailsList tr:last').after(printStr);
                }else {
                }
                i++;
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });
}

function confirmAdmit(doctorId, patientId, severityLevel) {

    $.ajax({
        type: "PUT",
        url:'http://localhost:8080/registerPatient?admitState=admit&patientId='+patientId+'&severityLevel='+severityLevel+'&doctorId='+doctorId ,
        success: function (data, status, xhr) {
            if(data.Response == "Admit Success"){
                console.log('admit successfully');
                toastr.success('patient admit successfully', 'Save Complete');
                window.location.replace("doctorDashboard.html");
                alert("Patient " +patientId+ " Admitted Successfully");
            }else if (data.Response == "Admit Error"){
                console.log('Not Admitted');
                toastr.success('patient admit Error', 'Incomplete');
                alert("Patient " +patientId+ " Not Admitted");
                window.location.replace("doctorDashboard.html");
            }else {
                console.log('Error');
                toastr.success('Error', 'Incomplete');
                alert("Error. Something Wrong..!");
                window.location.replace("doctorDashboard.html");
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}

function confirmDischarge(doctorId, patientId) {
    // alert(patientId + severityLevel);
    $.ajax({
        type: "PUT",
        url:'http://localhost:8080/registerPatient?admitState=discharge&patientId='+patientId+'&severityLevel=null&doctorId='+doctorId ,
        success: function (data, status, xhr) {
            if(data.Response == "Discharge Success"){
                console.log('Discharge Success');
                toastr.success('Patient Discharge Successfully', 'Save Complete');
                window.location.replace("doctorDashboard.html");
                alert("Patient " +patientId+ " Discharge Successfully");
            }else if (data.Response == "Discharge Error"){
                console.log('Not Discharge');
                toastr.success('Patient Discharge Error', 'Incomplete');
                alert("Patient " +patientId+ " Not Discharged");
                window.location.replace("doctorDashboard.html");
            }else {
                console.log('Error');
                toastr.success('Error', 'Incomplete');
                alert("Error. Something Wrong..!");
                window.location.replace("doctorDashboard.html");
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}
function registerPatient(){
    $.ajax({
        type: "POST",
        url:'http://localhost:8080/registerPatient/?firstName=Test&lastName=Karun&district=Colombo&locationX=409&locationY=797&gender=Male&contact=654&email=2email&age=22' ,
        success: function (data, status, xhr) {
            if(data.patientId != ""){
                // console.log('admit successfully');
                // toastr.success('patient admit successfully', 'Save Complete');
                alert("Patient " +data.patientId+ " Admitted Successfully");
            }else {
                // console.log('Error');
                // toastr.success('Error', 'Incomplete');
                alert("Error. Something Wrong..!");
                // window.location.replace("doctorDashboard.html");
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }

    });
}

function getStatistic(){
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/statistic?type=country',
        dataType: "json",
        success: function (data, status, xhr) {
            let printStr = '<tr><td>Total Infected</td><td>'+data.totalPatient+'</td></tr><tr><td>Total Patients</td><td>'+data.admittedCount+'</td></tr><tr><td>Total Healed</td><td>'+data.totalDischarge+'</td></tr>';
            $('#countryLevel tr:last').after(printStr);

        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });
}
