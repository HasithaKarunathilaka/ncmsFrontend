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

function getQueueDetails(){
    var i = 1;
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/moh/queueDetails?type=queue',
        dataType: "json",
        success: function (data, status, xhr) {
            $.each(data, function(key, queueDetail){
                let printStr = '<tr><td>'+i+'</td><td>'+queueDetail.patientId+'</td><td>'+queueDetail.id+'</td></tr>';
                $('#patientQueue tr:last').after(printStr);
                i++;
            });
            disableButton(i);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });
}