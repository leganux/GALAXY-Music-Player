$(document).ready(async function () {
    $('#nucleus_btn_sign_in').click(async function () {
        let email = $('#nucleus_input_email_sign_in').val()
        let password = $('#nucleus_input_password_sign_in').val()

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "password": password,
            "email": email
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        let response = await fetch("/auth/login", requestOptions)
        if (response.status == 403) {
            await Swal.fire({
                title: 'Error',
                text: 'User or password are incorrect',
                allowOutsideClick: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: "#3ba805",
                reverseButtons: true,
            });
        } else {
            let access = await response.json()
            window.sessionStorage.setItem('api_token', access?.data?.token)
            location.href = '/auth/createSession?token=' + access?.data?.token
            console.log(access)
        }


    })


    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    if (params.message) {
        let text = ''
        switch (params.message) {
            case 'invalid_token':
                text = 'The session token is invalid, try to re login'
                break;
            case 'notfound':
                text = 'The user has not found'
                break;
            case 'inactive':
                text = 'Your account has been deactivate contact support '
                break;
            default:
                text = 'an error has been occurred please report to support'
                break;
        }

        await Swal.fire({
            title: 'Error',
            text: text,
            allowOutsideClick: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: "#3ba805",
            reverseButtons: true,
        });

    }
})
