function registerUser() {
    fetch('127.0.0.1:8080//user?type=signup&userName=ceena&password=12&name=Cena1234&moh=0&hospital=0', {
        method: 'post'
    })
        .then(response => response.json() )
        .then(jsonData => {
            console.log(jsonData)
            window.location.href= '../login.php';
            alert('Registration Successful. Please Log In to Continue.');
        })
        .catch(err => {
            alert('Registration Failed.');
        })
}
// $userType = $_POST['userType'];
//this.registerUser();