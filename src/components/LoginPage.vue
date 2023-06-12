<template>
    <div class="login-container">
        <h1>LoginPage</h1>
        <form>
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" v-model="username" id="username" class="form-control" placeholder="Enter username">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" v-model="password" id="password" class="form-control" placeholder="Enter Password">
            </div>
            <button type="button" class="btn btn-primary" @click="loginpage">Submit</button>
            <button type="button" class="btn btn-primary" @click="$router.push('/registerpage')">Register</button>
        </form>
        <div v-if="loginSuccess">Login successful!</div>
        <div v-if="loginError">Wrong Username or Password</div>
    </div>
</template>
<style>
    .login-container {
        margin: 0 auto;
        padding: 2rem;
        max-width: 25rem;
    }

    .login-container h1 {
        text-align: center;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
    }

    .form-group label {
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    .form-control {
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #ced4da;
    }

    .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
    }
</style>
<script>
    export default {
        data() {
            return {
                username: '',
                password: '',
                role: '',
                loginSuccess: false,
                loginError: false,
                loginErrorMessage: '',
                accessToken: '', // add this line
            };
        },
        methods: {
            async loginpage() {
                try {
                    const payload = {
                        username: this.username,
                        password: this.password,
                        
                    };

                    const response = await fetch('https://chatwebapi.azurewebsites.net/api/Token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    })
                    const result = await response.json()
                    if (result.message.includes("Success")) {
                        // Handle successful login, such as redirecting to the home page
                        localStorage.setItem('token', result.response.accessToken);
            const token = localStorage.getItem('token');
            console.log(token);
                        this.loginSuccess = true;
                        this.loginError = false;
                        this.$router.push('/mainpage');
                    } else {
                        // Handle failed login, such as displaying an error message
                        this.loginErrorMessage = result.message;
                        this.loginSuccess = false;
                        this.loginError = true;
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }
</script>