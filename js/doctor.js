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

function getDoctorDetails(userType, hospitalId){
    var i = 1;
    var position = "Director";
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/doctor/doctorDetails?reason=full&hospitalId='+hospitalId,
        dataType: "json",
        success: function (data, status, xhr) {
            $.each(data, function(key, doctorDetail){
                if(doctorDetail.isDirector == 0){
                    position = "Doctor";
                }
                let printStr = '<tr><td>' + i + '</td><td>' + doctorDetail.id + '</td><td>' + doctorDetail.name + '</td><td>' + position +'</td><td>' + doctorDetail.email + '</td></tr>';
                $('#doctorDetails tr:last').after(printStr);
                i++;
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });

}

function registerDoctor(name, hospitalId, isDirector, email){
    // alert("Registration Successful");
    $.ajax({
        type: "PUT",
        url:'http://localhost:8080/doctor/addDoctor?name='+name+'&hospitalId='+hospitalId+'&isDirector='+isDirector+'&email='+email ,
        // url:'http://localhost:8080/doctor/addDoctor?name=test123&hospitalId=37718435-9688-4605-9f8c-380a7484429e&isDirector=0&email=test@123',
        success: function (data, status, xhr) {
            // alert("Work");
            if(data.Response != "Registration Failed"){
                alert("Your ID is " +data.Response+ " ");
                console.log('register successfully');
                toastr.success('doctor register successfully', 'Save Complete');
                window.location.replace("doctorList.html");

            }else {
                console.log('Error');
                toastr.success('Error', 'Incomplete');
                alert("Error. Something Wrong..!");
                window.location.replace("addDoctor.html");
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            toastr.error('Something went wrong! ' + errorMessage, 'Error')
        }
    });
    alert("Registration Successful");
    // window.location.replace("doctorList.html");
}