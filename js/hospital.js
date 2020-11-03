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

function getHospitalDetials(hospitalId) {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/doctor/dashboard?reason=bedInformation&hospitalId='+hospitalId,
        dataType: "json",
        success: function (data, status, xhr) {
                let printStr = '<tr><td>Reserved Beds : </td><td>' + data.reservedBed + '</td></tr><tr><td>Available Beds : </td><td>' + data.availableBed + '</td></tr>';
                $('#hospitalStatistic tr:last').after(printStr);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });
}