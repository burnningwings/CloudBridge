$(function() {
    $('#login_form').ajaxForm({
        beforeSubmit:checkForm,
        success:complete,
        dataType:'json'
    });
    function checkForm(){
        // alert("hello")
    }
    function complete(response){
        if(response["status"]=="0"){
            console.log(response.msg)
            var token = response["data"]["token"];
            // alert(token)
            setToken(token)
            // webRequest("index.html","POST",false,{"token":token})
            location.href="index.html?token="+token;
        }
    }
});