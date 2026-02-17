const http = require('http');

const userData = JSON.stringify({
    name: 'Test User',
    email: 'testuser' + Date.now() + '@example.com',
    password: 'securePassword123'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/users',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': userData.length
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        const response = JSON.parse(data);
        console.log('Response:', response);

        if (response.success && response.user.id) {
            console.log('TEST PASSED: User created successfully.');
            if (!response.user.password_hash && !response.user.password) {
                console.log('TEST PASSED: Password is not returned in response (good security practice).');
            } else {
                console.log('TEST WARNING: Password or hash returned in response.');
            }
        } else {
            console.log('TEST FAILED: User creation failed.');
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(userData);
req.end();
